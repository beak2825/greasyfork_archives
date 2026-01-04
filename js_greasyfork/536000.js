// ==UserScript==
// @name         Inbound Flow Control ...on steroids! MAN1
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  An upgrade for Inboud Flow Control portal.
// @author       Lukasz Milcz - milcz@amazon.com
// @match        https://inbound-flow-control.amazon.com/powerup/MAN1*
// @icon         https://s.widget-club.com/samples/TtQGtKUoGBUH0Mui8cYtKq3O8ZA3/8923mQwOV1dmFPqAkuW0/72E056B9-B636-4460-BAAF-7D413CA2FF38.jpg?q=70
// @grant        GM.xmlHttpRequest
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js
// @resource     CHART_JS_CSS https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/536000/Inbound%20Flow%20Control%20on%20steroids%21%20MAN1.user.js
// @updateURL https://update.greasyfork.org/scripts/536000/Inbound%20Flow%20Control%20on%20steroids%21%20MAN1.meta.js
// ==/UserScript==


// Changes to implement:
//give more flexibility in terms of buffer fowards EOS
//create a graf with direct and indirect HC calculating invested time per last PPR hour
//create a graf with trends for rates and TPH - maybe
//show 5 bottom performers per process - maybe
//show compliance for totes scanned to dropzones on stow - Adam and Anisha
//live shift volume calculator - insert planned rates as well as LS numbers and check if you are on target against actual state
//



///////////GLOBAL SETTINGS
    //set shift and current time
let currentShift = ''
let currentPage = 'main'
const bufferExpInHours = 2
let time = ''
let hour = ''
let minutes = ''
let day = ''
let month = ''
let year = ''
function setTimeAndShift() {
    time = new Date()
    hour = time.getHours()
    minutes = time.getMinutes()
    day = time.getDate()
    if (day < 10) {
     day = '0' + day
    }
    month = time.getMonth() + 1
    if (month < 10) {
     month = '0' + month
    }
    year = time.getFullYear()

    if ((hour >= 8 && minutes >= 30) && (hour < 19)) {
        currentShift = 'DS'
    } else if ((hour >= 19 && minutes >= 30) || (hour < 6)) {
        currentShift = 'NS'
    } else {
        currentShift = 'betweenShifts'
    }
}
setTimeAndShift()

/////////// HTTP REQUESTS
    //get stow rate
async function getStowRate() {
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: 'https://roboscout.amazon.com/view_plot_data/?sites=(MAN1)&current_day=false&startDateTime=-2+hours&endDateTime=today&mom_ids=321&osm_ids=31&oxm_ids=435&ofm_ids=&viz=nvd3Table&instance_id=2210&object_id=19851&BrowserTZ=Europe%2FLondon&app_name=RoboScout',
        onload: (response) => {
          resolve(response.response.data);
        },
      });
    });
    return response
  }
//const stowRatesRaw = await getStowRate()

    //get worked hours on each field during last 2 hours
async function getWorkedHours() {
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: "https://roboscout.amazon.com/view_plot_data/?sites=(MAN1)&current_day=false&startDateTime=-2+hours&endDateTime=today&mom_ids=720&osm_ids=31&oxm_ids=435&ofm_ids=&viz=nvd3Table&instance_id=2210&object_id=19851&BrowserTZ=Europe%2FLondon&app_name=RoboScout",
        onload: (response) => {
          resolve(response.response.data);
        },
      });
    });
    return response
  }
//const workedHours = await getWorkedHours()

//get current stow headcount
async function getCurrentHeadcount() {
    const url = 'https://roboscout.amazon.com/view_plot_data/?sites=(MAN1)&instance_id=2005&object_id=20604&BrowserTZ=Europe/London&app_name=RoboScout'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response.data);
        },
      });
    });
    return response
  }
//const currentHeadcount = await getCurrentHeadcount()

//get historical stow headcount
async function getHistoricalHeadcount() {
    let url = ''
    if (currentShift == 'DS') {
    url = `https://roboscout.amazon.com/view_plot_data/?sites=(MAN1)&current_day=false&startDateTime=${year}-${month}-${day}+07%3A00%3A00&endDateTime=${year}-${month}-${day}%3A30%3A00&mom_ids=338&osm_ids=31&oxm_ids=436&ofm_ids=&viz=nvd3Table&instance_id=2210&object_id=19851&BrowserTZ=Europe%2FLondon&app_name=RoboScout`
    } else {}
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response.data);
        },
      });
    });
    return response
  }
//const historicalHeadcount = await getHistoricalHeadcount()

//get buffer count
async function getBuffer() {
    const startTime = time - 86400000
    const endTime = time - 30000
    const url = 'https://inbound-flow-svc-dub-prod.amazon.com/'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "POST",
        responseType: "json",
        referrer: "https://inbound-flow-control.amazon.com/",
        headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/x-amz-json-1.0",
        "X-Amz-Target": "AFTInboundFlowControlService.GetFcFlowSnapshot",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "referrer": "https://inbound-flow-control.amazon.com/"
        },
        url: url,
        data: "{\"warehouseId\":\"MAN1\"}",
        onload: (response) => {
          resolve(response);
        },
      });
    });
    return response.response.warehouse.locations[2].childLocations
  }
//const buffer = await getBuffer()

//get P2 buffer count
async function getBufferP2() {
    const startTime = time - 86400000
    const endTime = time - 30000
    const url = 'https://ifc-historical-data-svc-dub.amazon.com/'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "POST",
        responseType: "json",
        headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json; charset=utf-8",
        "X-Amz-Target": "com.amazon.aftifchistoricaldataservice.AFTIFCHistoricalDataService.GetLocationHistory",
        "Content-Encoding": "amz-1.0",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site"
        },
        url: url,
        data: `{\"warehouseId\":{\"id\":\"MAN1\"},\"locationHistoryRequestList\":[{\"locationId\":{\"id\":\"fl-2\",\"type\":\"SCANNABLE_ID\"},\"ifcProcessName\":\"Stow\",\"startTimeMillis\":${startTime},\"endTimeMillis\":${endTime}}]}`,
        onload: (response) => {
          resolve(response);
        },
      });
    });
    return response.response.successLocationHistoryList[0].dataPointSet.sort((a, b) => b.timestamp - a.timestamp)
  }
//const bufferP2 = await getBufferP2()

//get P3 buffer count
async function getBufferP3() {
    const startTime = time - 86400000
    const endTime = time - 30000
    const url = 'https://ifc-historical-data-svc-dub.amazon.com/'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "POST",
        responseType: "json",
        headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json; charset=utf-8",
        "X-Amz-Target": "com.amazon.aftifchistoricaldataservice.AFTIFCHistoricalDataService.GetLocationHistory",
        "Content-Encoding": "amz-1.0",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site"
        },
        url: url,
        data: `{\"warehouseId\":{\"id\":\"MAN1\"},\"locationHistoryRequestList\":[{\"locationId\":{\"id\":\"fl-3\",\"type\":\"SCANNABLE_ID\"},\"ifcProcessName\":\"Stow\",\"startTimeMillis\":${startTime},\"endTimeMillis\":${endTime}}]}`,
        onload: (response) => {
          resolve(response);
        },
      });
    });
    return response.response.successLocationHistoryList[0].dataPointSet.sort((a, b) => b.timestamp - a.timestamp)
  }
//const bufferP3 = await getBufferP3()

//get P4 buffer count
async function getBufferP4() {
    const startTime = time - 86400000
    const endTime = time - 30000
    const url = 'https://ifc-historical-data-svc-dub.amazon.com/'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "POST",
        responseType: "json",
        headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json; charset=utf-8",
        "X-Amz-Target": "com.amazon.aftifchistoricaldataservice.AFTIFCHistoricalDataService.GetLocationHistory",
        "Content-Encoding": "amz-1.0",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site"
        },
        url: url,
        data: `{\"warehouseId\":{\"id\":\"MAN1\"},\"locationHistoryRequestList\":[{\"locationId\":{\"id\":\"fl-4\",\"type\":\"SCANNABLE_ID\"},\"ifcProcessName\":\"Stow\",\"startTimeMillis\":${startTime},\"endTimeMillis\":${endTime}}]}`,
        onload: (response) => {
          resolve(response);
        },
      });
    });
    return response.response.successLocationHistoryList[0].dataPointSet.sort((a, b) => b.timestamp - a.timestamp)
  }
//const bufferP4 = await getBufferP4()

//get current bin fullness
async function getBinFullness() {
    const url = 'https://roboscout.amazon.com/view_plot_data/?sites=(MAN1)&mom_ids=1924&osm_ids=1267&oxm_ids=2148&ofm_ids=&instance_id=0&object_id=21284&BrowserTZ=Europe%2FLondon&app_name=RoboScout'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response.data);
        },
      });
    });
    return response
  }

//get current bin fullness per bin size
async function getBinFullnessBinSize() {
    const url = 'https://roboscout.amazon.com/view_plot_data/?sites=(MAN1)&mom_ids=1924&osm_ids=1595&oxm_ids=2148&ofm_ids=&instance_id=0&object_id=21284&BrowserTZ=Europe%2FLondon&app_name=RoboScout'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response.data);
        },
      });
    });
    return response
  }

//get PPR data
async function getPPRdataETI() {
    const startTime = new Date(time - 7200000)
    const endTime = new Date(time)
    let startHour = startTime.getHours()
    if (startHour < 10) {
     startHour = '0' + startHour
    }
    let startMinute = startTime.getMinutes()
    if (startMinute < 10) {
     startMinute = '0' + startMinute
    }
    let endHour = endTime.getHours()
    if (endHour < 10) {
     endHour = '0' + endHour
    }
    let endMinute = endTime.getMinutes()
    if (endMinute < 10) {
     endMinute = '0' + endMinute
    }
    const url = `https://fclm-portal.amazon.com/reports/functionRollup?warehouseId=MAN1&spanType=Intraday&startDate=${year}-${month}-${day}T${startHour}:${startMinute}:00.000&endDate=${year}-${month}-${day}T${endHour}:${endMinute}:00.000&reportFormat=HTML&processId=01002976`
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url: url,

        onload: (response) => {
          resolve(response);
        },
      });
    });
    return response.response
  }
//const pprData = await getPPRdata()

//get assigned product mix data
async function getAssignedProductMix() {
    const url = 'https://monitorportal.amazon.com/mws/data?Action=GetGraph&Version=2007-07-07&SchemaName1=Search&Pattern1=servicename%3D%24KivaStowWorkPlannerService%24+KIVA-DEEP.qty+station+AMZN%2FMAN1%2FpaKivaA02+marketplace%3D%24prod.EUFulfillment%24+methodname%3D%24CreatePlan%24+&Period1=OneHour&Stat1=sum&SchemaName2=Search&Pattern2=servicename%3D%24KivaStowWorkPlannerService%24+KIVA-DEEP.qty+station+AMZN%2FMAN1%2FpaKivaA03+marketplace%3D%24prod.EUFulfillment%24+methodname%3D%24CreatePlan%24+&SchemaName3=Search&Pattern3=servicename%3D%24KivaStowWorkPlannerService%24+KIVA-DEEP.qty+station+AMZN%2FMAN1%2FpaKivaA04+marketplace%3D%24prod.EUFulfillment%24+methodname%3D%24CreatePlan%24+&SchemaName4=Search&Pattern4=servicename%3D%24KivaStowWorkPlannerService%24+6-KIVA-DEEP.qty+station+AMZN%2FMAN1%2FpaKivaA02+marketplace%3D%24prod.EUFulfillment%24+methodname%3D%24CreatePlan%24+schemaname%3DService+&SchemaName5=Search&Pattern5=servicename%3D%24KivaStowWorkPlannerService%24+9-KIVA-DEEP.qty+station+AMZN%2FMAN1%2FpaKivaA02+marketplace%3D%24prod.EUFulfillment%24+methodname%3D%24CreatePlan%24+schemaname%3DService+&SchemaName6=Search&Pattern6=servicename%3D%24KivaStowWorkPlannerService%24+6-KIVA-DEEP.qty+station+AMZN%2FMAN1%2FpaKivaA03+marketplace%3D%24prod.EUFulfillment%24+methodname%3D%24CreatePlan%24+schemaname%3DService+&SchemaName7=Search&Pattern7=servicename%3D%24KivaStowWorkPlannerService%24+9-KIVA-DEEP.qty+station+AMZN%2FMAN1%2FpaKivaA03+marketplace%3D%24prod.EUFulfillment%24+methodname%3D%24CreatePlan%24+schemaname%3DService+&SchemaName8=Search&Pattern8=servicename%3D%24KivaStowWorkPlannerService%24+6-KIVA-DEEP.qty+station+AMZN%2FMAN1%2FpaKivaA04+marketplace%3D%24prod.EUFulfillment%24+methodname%3D%24CreatePlan%24+schemaname%3DService+&SchemaName9=Search&Pattern9=servicename%3D%24KivaStowWorkPlannerService%24+9-KIVA-DEEP.qty+station+AMZN%2FMAN1%2FpaKivaA04+marketplace%3D%24prod.EUFulfillment%24+methodname%3D%24CreatePlan%24+schemaname%3DService+&HeightInPixels=773&WidthInPixels=1718&GraphTitle=Product+mix+assigned+per+floor&LegendPlacement=right&DecoratePoints=true&TZ=Europe%2FLondon%40TZ%3A+London&ShowLegendErrors=false&LabelLeft=Quantity&StartTime1=-PT2H&EndTime1=-PT0H&FunctionExpression1=SUM%28S4%2CS5%29%2FSUM%28S1%29&FunctionLabel1=A02+%5Bavg%3A+%7Bavg%7D%5D&FunctionYAxisPreference1=left&FunctionExpression2=SUM%28S6%2CS7%29%2FSUM%28S2%29&FunctionLabel2=A03+%5Bavg%3A+%7Bavg%7D%5D&FunctionYAxisPreference2=left&FunctionExpression3=SUM%28S8%2CS9%29%2FSUM%28S3%29&FunctionLabel3=A04+%5Bavg%3A+%7Bavg%7D%5D&FunctionYAxisPreference3=left'
	const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.responseText);
        },
      });
    });
    return response
  }

//get injection
async function getInjection() {
    const url = 'https://monitorportal.amazon.com/mws/data?Action=GetGraph&Version=2007-07-07&SchemaName1=Service&DataSet1=Prod&Marketplace1=MAN1-ReceiveRouterController&HostGroup1=ALL&Host1=ALL&ServiceName1=WarehouseControlService&MethodName1=SortationOrchestrator.divert&Client1=ALL&MetricClass1=NONE&Instance1=NONE&Metric1=intermediateRequestedDivertId-R101&Period1=FiveMinute&Stat1=sum&Label1=intermediateRequestedDivertId-R101&SchemaName2=Service&Metric2=intermediateRequestedDivertId-R103&Label2=intermediateRequestedDivertId-R103&SchemaName3=Service&Metric3=intermediateRequestedDivertId-R102&Label3=intermediateRequestedDivertId-R102&HeightInPixels=773&WidthInPixels=1718&GraphTitle=Receive Router Recirc last 12 hours&DecoratePoints=true&TZ=Europe/London@TZ: London&StartTime1=-PT12H&EndTime1=-PT0M'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.responseText);
        },
      });
    });
    return response
  }

//get recirc
async function getRecirc() {
    const url = 'https://monitorportal.amazon.com/mws/data?Action=GetGraph&Version=2007-07-07&SchemaName1=Service&DataSet1=Prod&Marketplace1=MAN1&HostGroup1=ALL&Host1=ALL&ServiceName1=FCContainerRoutingService&MethodName1=ALL&Client1=ALL&MetricClass1=NONE&Instance1=NONE&Metric1=ReceiveRouter%3Ascans&Period1=FiveMinute&Stat1=n&Label1=Scans&UserLabel1=Scans&SchemaName2=Service&Marketplace2=MAN1-ReceiveRouterController&ServiceName2=WarehouseControlService&MethodName2=SortationOrchestrator.scan&Metric2=01-recirc&Label2=MAN1-ReceiveRouterController%20WarehouseControlService%20SortationOrchestrator.scan%2001-recirc&HeightInPixels=581&WidthInPixels=1398&GraphTitle=Receive%20Router%20Recirc%20last%2012%20hours&DecoratePoints=true&TZ=Europe%2FLondon@TZ%3A%20London&HorizontalLineLeft1=10%25%20Recirc%20-%20@%2010%20&LabelLeft=Recirc%20Percent&StartTime1=-PT12H&EndTime1=-PT0H&FunctionExpression1=M2%20%2F%20M1%20*%20100&FunctionLabel1=Recirc%20%5Bavg%3A%20%7Bavg%7D%20%25%5D&FunctionYAxisPreference1=left&FunctionColor1=default'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.responseText);
        },
      });
    });
    return response
  }


//get units stowed
async function getUnitsStowed() {
    const url = 'https://roboscout.amazon.com/view_plot_data/?sites=(MAN1)&current_day=true&startDateTime=today&endDateTime=today&mom_ids=632&osm_ids=30&oxm_ids=1745&ofm_ids=775&viz=nvd3Table&extend_datetime_to_shift_start=true&instance_id=1927&object_id=19851&BrowserTZ=Europe%2FLondon&app_name=RoboScout'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response.data);
        },
      });
    });
    return response
  }

//p2A all stations
async function getp2AStations() {
    const url = 'https://vantage.amazon.com/api/eu-west-1/fulfillment?dataset=station_map/stations_with_station_metrics&podGapLookBackInMinutes=15&warehouse=MAN1&zone=paKivaA02'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response);
        },
      });
    });
    return response
  }

//p3A all stations
async function getp3AStations() {
    const url = 'https://vantage.amazon.com/api/eu-west-1/fulfillment?dataset=station_map/stations_with_station_metrics&podGapLookBackInMinutes=15&warehouse=MAN1&zone=paKivaA03'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response);
        },
      });
    });
    return response
  }

//p4A all stations
async function getp4AStations() {
    const url = 'https://vantage.amazon.com/api/eu-west-1/fulfillment?dataset=station_map/stations_with_station_metrics&podGapLookBackInMinutes=15&warehouse=MAN1&zone=paKivaA04'
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response);
        },
      });
    });
    return response
  }

//p2A stations with associates
async function getp2AStationsTaken() {
    const url = `https://vantage.amazon.com/api/eu-west-1/fulfillment?dataset=station_map/stations_with_associate_metrics&startDateTime=${year}-${month}-${day}T05:00:00.000Z&warehouse=MAN1&zone=paKivaA02`
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response);
        },
      });
    });
    return response
  }

//p3A stations with associates
async function getp3AStationsTaken() {
    const url = `https://vantage.amazon.com/api/eu-west-1/fulfillment?dataset=station_map/stations_with_associate_metrics&startDateTime=${year}-${month}-${day}T05:00:00.000Z&warehouse=MAN1&zone=paKivaA03`
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response);
        },
      });
    });
    return response
  }

//p4A stations with associates
async function getp4AStationsTaken() {
    const url = `https://vantage.amazon.com/api/eu-west-1/fulfillment?dataset=station_map/stations_with_associate_metrics&startDateTime=${year}-${month}-${day}T05:00:00.000Z&warehouse=MAN1&zone=paKivaA04`
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.response);
        },
      });
    });
    return response
  }

//P2 line fullness
async function getP2LineFullness() {
    const url = `https://monitorportal.amazon.com/mws/data?Action=GetGraph&Version=2007-07-07&SchemaName1=Service&DataSet1=Prod&Marketplace1=MAN1-ReceiveRouterController&HostGroup1=ALL&Host1=ALL&ServiceName1=WarehouseControlService&MethodName1=SortationOrchestrator.divert&Client1=ALL&MetricClass1=NONE&Instance1=NONE&Metric1=missedRequestedDivertId-R103&Period1=FiveMinute&Stat1=n&ValueUnit1=request&Label1=n&UserLabel1=n&HeightInPixels=250&WidthInPixels=600&DecoratePoints=true&TZ=Europe%2FLondon@TZ%3A%20London&StartTime1=-PT12H&EndTime1=-P0D`
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.responseText);
        },
      });
    });
    return response
  }

//P3 line fullness
async function getP3LineFullness() {
    const url = `https://monitorportal.amazon.com/mws/data?Action=GetGraph&Version=2007-07-07&SchemaName1=Service&DataSet1=Prod&Marketplace1=MAN1-ReceiveRouterController&HostGroup1=ALL&Host1=ALL&ServiceName1=WarehouseControlService&MethodName1=SortationOrchestrator.divert&Client1=ALL&MetricClass1=NONE&Instance1=NONE&Metric1=missedRequestedDivertId-R102&Period1=FiveMinute&Stat1=n&ValueUnit1=request&Label1=n&UserLabel1=n&HeightInPixels=250&WidthInPixels=600&DecoratePoints=true&TZ=Europe%2FLondon@TZ%3A%20London&StartTime1=-PT12H&EndTime1=-P0D`
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.responseText);
        },
      });
    });
    return response
  }

//P4 line fullness
async function getP4LineFullness() {
    const url = `https://monitorportal.amazon.com/mws/data?Action=GetGraph&Version=2007-07-07&SchemaName1=Service&DataSet1=Prod&Marketplace1=MAN1-ReceiveRouterController&HostGroup1=ALL&Host1=ALL&ServiceName1=WarehouseControlService&MethodName1=SortationOrchestrator.divert&Client1=ALL&MetricClass1=NONE&Instance1=NONE&Metric1=missedRequestedDivertId-R101&Period1=FiveMinute&Stat1=n&ValueUnit1=request&Label1=n&UserLabel1=n&HeightInPixels=250&WidthInPixels=600&DecoratePoints=true&TZ=Europe%2FLondon@TZ%3A%20London&StartTime1=-PT12H&EndTime1=-P0D`
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.responseText);
        },
      });
    });
    return response
  }

//PPR historical data
async function pprHistoricalData(startDate, endDate) {
    const startDateYear = startDate.getFullYear()
    const startDateMonth = startDate.getMonth() + 1
    const startDateDay = startDate.getDate()
    const startDateHours = startDate.getHours()
    const startDateMinutes = startDate.getMinutes()
    const endDateYear = endDate.getFullYear()
    const endDateMonth = endDate.getMonth() + 1
    const endDateDay = endDate.getDate()
    const endDateHours = endDate.getHours()
    const endDateMinutes = endDate.getMinutes()
    const url = `https://fclm-portal.amazon.com/reports/processPathRollup?reportFormat=HTML&warehouseId=MAN1&startDateDay=${startDateYear}/${startDateMonth}/${startDateDay}&maxIntradayDays=1&spanType=Intraday&startDateIntraday=${startDateYear}/${startDateMonth}/${startDateDay}&startHourIntraday=${startDateHours}&startMinuteIntraday=${startDateMinutes}&endDateIntraday=${endDateYear}/${endDateMonth}/${endDateDay}&endHourIntraday=${endDateHours}&endMinuteIntraday=${endDateMinutes}&adjustPlanHours=true&_adjustPlanHours=on&_hideEmptyLineItems=on&employmentType=AllEmployees`
    const response = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        responseType: "json",
        url: url,

        onload: (response) => {
          resolve(response.responseText);
        },
      });
    });
    return response
  }

/////////////////////
//////////////////// GLOBAL VARIABLES
let p2headcount = ''
let p3headcount = ''
let p4headcount = ''
let totalHeadcount = ''
let p2rate = ''
let p3rate = ''
let p4rate = ''
let totalRates = ''
let p2consumption = ''
let p3consumption = ''
let p4consumption = ''
let p2bufferplus = ''
let p3bufferplus = ''
let p4bufferplus = ''
let p2bufferminus = ''
let p3bufferminus = ''
let p4bufferminus = ''
let p2buffer = ''
let p3buffer = ''
let p4buffer = ''
let p2delta = ''
let p3delta = ''
let p4delta = ''
let p2headcountA = ''
let p3headcountA = ''
let p4headcountA = ''
let p2ratesA = ''
let p3ratesA = ''
let p4ratesA = ''
let p2hoursA = ''
let p3hoursA = ''
let p4hoursA = ''
let p2prodmixA = ''
let p3prodmixA = ''
let p4prodmixA = ''
let p2fullnessA = ''
let p3fullnessA = ''
let p4fullnessA = ''
let totalConsumption = ''
let totalBuffer = ''
let bufferInHours = ''
let totalInjection = ''
let totalDelta = ''
let bufferValues = [];
let labels = []
let bufferValuesPlus = []
let bufferValuesMinus = []
let totalBufferPlus = ''
let totalBufferMinus = ''
let mainChart = ''
let recircChart = ''
let colors = []
let p2injection = ''
let p3injection = ''
let p4injection = ''
let p2fullness6A = ''
let p2fullness9A = ''
let p2fullness11A = ''
let p2fullness14A = ''
let p2fullness18A = ''
let p3fullness6A = ''
let p3fullness9A = ''
let p3fullness11A = ''
let p3fullness14A = ''
let p3fullness18A = ''
let p4fullness6A = ''
let p4fullness9A = ''
let p4fullness11A = ''
let p4fullness14A = ''
let p4fullness18A = ''
let p2unitsPerTote = ''
let p3unitsPerTote = ''
let p4unitsPerTote = ''
let unitsPerTote = ''
let recircTimeStamps = ''
let recircValues = ''
let p2LineFullnessValues = ''
let p3LineFullnessValues = ''
let p4LineFullnessValues = ''
///////////////////
//////////////////

//set document title and favicon
document.title = 'Inbound Flow Control... on steroids!'
let flav = document.createElement('link');
flav.rel = 'icon';
document.head.appendChild(flav);
flav.href = 'https://s.widget-club.com/samples/TtQGtKUoGBUH0Mui8cYtKq3O8ZA3/8923mQwOV1dmFPqAkuW0/72E056B9-B636-4460-BAAF-7D413CA2FF38.jpg?q=70'

//create main window
document.getElementsByTagName('body')[0].style.fontFamily = 'Verdana, sans-serif'
document.getElementsByTagName('body')[0].style.position = 'relative'
document.getElementsByTagName('body')[0].style.margin = '0'
document.getElementsByTagName('body')[0].style.padding = '0 0 50px'
document.getElementsByTagName('body')[0].style.minHeight = '100vh'
document.getElementsByTagName('body')[0].style.backgroundColor = '#FAFAFA'
document.getElementsByTagName('body')[0].innerHTML = ''

//create title
const title = document.createElement('div')
const titleH1 = document.createElement('div')
const titleH2 = document.createElement('div')
document.getElementsByTagName('body')[0].appendChild(title)
title.appendChild(titleH1)
title.appendChild(titleH2)
titleH1.innerHTML = 'Inbound Flow Control'
titleH2.innerHTML = '...on steroids!'
title.style.textAlign = 'center'
title.style.backgroundColor = '#f5f5f5'
title.style.padding = '0.5em'
title.style.border = '1px solid black'
title.style.borderRadius = '15px'
title.style.maxWidth = '1200px'
title.style.margin = 'auto'
titleH1.style.fontWeight = 'bold'
titleH1.style.fontSize = '2.5em'
titleH2.style.marginLeft = '30%'
titleH2.style.fontStyle = 'italic'
titleH2.style.fontFamily = 'Bradley Hand, cursive'
titleH2.style.color = '#FF0000'

//create menu
const menuContainer = document.createElement('div')
const menu = document.createElement('div')
const flowControl = document.createElement('a')
const diveDeep = document.createElement('a')
const emptyStations = document.createElement('a')
document.getElementsByTagName('body')[0].appendChild(menuContainer)
menuContainer.appendChild(menu)
menu.appendChild(flowControl)
menu.appendChild(diveDeep)
menu.appendChild(emptyStations)
menuContainer.style.width = '100%'
menuContainer.style.backgroundColor = 'rgb(193, 193, 193)'
menuContainer.style.textAlign = 'center'
menuContainer.style.position = 'sticky'
menuContainer.style.top = '0'
menuContainer.style.fontSize = '0.8em'
menuContainer.style.padding = '5px 0px'
menu.style.width = '50%'
menu.style.display = 'flex'
menu.style.margin = 'auto'
menu.style.justifyContent = 'space-around'
flowControl.innerHTML = 'Flow Control'
diveDeep.innerHTML = 'Dive Deep'
emptyStations.innerHTML = 'Empty Stations'


//create loading element
const loadingElement = document.createElement('h2')
document.getElementsByTagName('body')[0].appendChild(loadingElement)
loadingElement.innerHTML = 'Loading data...'
loadingElement.style.margin = '40vh auto'
loadingElement.style.textAlign = 'center'
loadingElement.style.fontWeight = 'normal'

//create a footer
const footer = document.createElement('footer')
document.getElementsByTagName('body')[0].appendChild(footer)
footer.style.width = '100%'
footer.style.backgroundColor = 'rgb(193, 193, 193)'
footer.style.position = 'absolute'
footer.style.bottom = '0'
footer.style.textAlign = 'center'
footer.style.fontStyle = 'italic'
footer.style.fontSize = '0.8em'
footer.style.padding = '5px 0px'
footer.innerHTML = 'Created by Lukasz Milcz - milcz@amazon.com'



let currentURL = window.location.href
if (currentURL == 'https://inbound-flow-control.amazon.com/powerup/MAN1') {
    createTable()
} else if (currentURL == 'https://inbound-flow-control.amazon.com/powerup/MAN1/emptystations') {
    emptyStationsPage()
} else if (currentURL == 'https://inbound-flow-control.amazon.com/powerup/MAN1/divedeep') {
    diveDeepPage()
}




///////////FUNCTIONS
///create table with content
async function createTable() {
    emptyStations.setAttribute('href', 'https://inbound-flow-control.amazon.com/powerup/MAN1/emptystations')
    diveDeep.setAttribute('href', 'https://inbound-flow-control.amazon.com/powerup/MAN1/divedeep')
    diveDeep.style.color = 'black'
    emptyStations.style.color = 'black'
    flowControl.style.color = 'rgb(255, 0, 0)'
    flowControl.style.fontWeight = 'bold'
    try
    {
    let stowRatesRaw = await getStowRate()
    let workedHours = await getWorkedHours()
    let currentHeadcount = await getCurrentHeadcount()
    let bufferP2 = await getBufferP2()
    let bufferP3 = await getBufferP3()
    let bufferP4 = await getBufferP4()
    let assignedProductMixRequest = await getAssignedProductMix()
    let binFullness = await getBinFullness()
    let unitsStowed = await getUnitsStowed()
    let injectionData = await getInjection()
    let recircData = await getRecirc()
    let fullnessPerBinSize = await getBinFullnessBinSize()
    let buffer = await getBuffer()
    let p2LineFullnessData = await getP2LineFullness()
    let p3LineFullnessData = await getP3LineFullness()
    let p4LineFullnessData = await getP4LineFullness()


    //do calculations
    p2headcount = (typeof currentHeadcount[7]?.yValue != 'undefined' ? Number(currentHeadcount[7]?.yValue) : 0) + (typeof currentHeadcount[58]?.yValue != 'undefined' ? Number(currentHeadcount[58]?.yValue) : 0)
    p3headcount = (typeof currentHeadcount[24]?.yValue != 'undefined' ? Number(currentHeadcount[24]?.yValue) : 0) + (typeof currentHeadcount[75]?.yValue != 'undefined' ? Number(currentHeadcount[75]?.yValue) : 0)
    p4headcount = (typeof currentHeadcount[41]?.yValue != 'undefined' ? Number(currentHeadcount[41]?.yValue) : 0) + (typeof currentHeadcount[92]?.yValue != 'undefined' ? Number(currentHeadcount[92]?.yValue) : 0)
    totalHeadcount = (p2headcount + p3headcount + p4headcount) || 0
    p2hoursA = (typeof workedHours[1]?.yValue != 'undefined' ? Math.round(workedHours[1]?.yValue) : 0)
    p3hoursA = (typeof workedHours[3]?.yValue != 'undefined' ? Math.round(workedHours[3]?.yValue) : 0)
    p4hoursA = (typeof workedHours[5]?.yValue != 'undefined' ? Math.round(workedHours[5]?.yValue) : 0)
    p2rate = Math.round((((typeof stowRatesRaw[1]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[1]?.yValue)) : 0) * p2hoursA) + ((typeof stowRatesRaw[7]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[7]?.yValue)) : 0))) / (p2hoursA)) || 0
    p3rate = Math.round((((typeof stowRatesRaw[3]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[3]?.yValue)) : 0) * p3hoursA) + ((typeof stowRatesRaw[9]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[9]?.yValue)) : 0))) / (p3hoursA)) || 0
    p4rate = Math.round((((typeof stowRatesRaw[5]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[5]?.yValue)) : 0) * p4hoursA) + ((typeof stowRatesRaw[11]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[11]?.yValue)) : 0))) / (p4hoursA)) || 0
    totalRates = Math.round(((p2rate * (p2hoursA)) + (p3rate * (p3hoursA)) + (p4rate * (p4hoursA))) / ((p2hoursA) + (p3hoursA) + (p4hoursA))) || 0
    p2consumption = p2headcount * p2rate
    p3consumption = p3headcount * p3rate
    p4consumption = p4headcount * p4rate
    p2bufferplus = Math.round((p2headcount * p2rate * bufferExpInHours) + (p2headcount * p2rate * bufferExpInHours) * 20 / 100)
    p3bufferplus = Math.round((p3headcount * p3rate * bufferExpInHours) + (p3headcount * p3rate * bufferExpInHours) * 20 / 100)
    p4bufferplus = Math.round((p4headcount * p4rate * bufferExpInHours) + (p4headcount * p4rate * bufferExpInHours) * 20 / 100)
    p2bufferminus = Math.round((p2headcount * p2rate * bufferExpInHours) - (p2headcount * p2rate * bufferExpInHours) * 20 / 100)
    p3bufferminus = Math.round((p3headcount * p3rate * bufferExpInHours) - (p3headcount * p3rate * bufferExpInHours) * 20 / 100)
    p4bufferminus = Math.round((p4headcount * p4rate * bufferExpInHours) - (p4headcount * p4rate * bufferExpInHours) * 20 / 100)
    totalBufferPlus = p2bufferplus + p3bufferplus + p4bufferplus
    totalBufferMinus = p2bufferminus + p3bufferminus + p4bufferminus
    p2buffer = bufferP2[0].data['unit-count']
    p3buffer = bufferP3[0].data['unit-count']
    p4buffer = bufferP4[0].data['unit-count']
    p2delta = Math.floor((bufferP2[0].data['unit-count'] - (p2headcount * p2rate * bufferExpInHours)))
    p3delta = Math.floor((bufferP3[0].data['unit-count'] - (p3headcount * p3rate * bufferExpInHours)))
    p4delta = Math.floor((bufferP4[0].data['unit-count'] - (p4headcount * p4rate * bufferExpInHours)))
    p2headcountA = Number(typeof currentHeadcount[7]?.yValue != 'undefined' ? Number(currentHeadcount[7]?.yValue) : 0)
    p3headcountA = Number(typeof currentHeadcount[24]?.yValue != 'undefined' ? Number(currentHeadcount[24]?.yValue) : 0)
    p4headcountA = Number(typeof currentHeadcount[41]?.yValue != 'undefined' ? Number(currentHeadcount[41]?.yValue) : 0)
    p2ratesA = typeof stowRatesRaw[1]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[1]?.yValue)) : 0
    p3ratesA = typeof stowRatesRaw[3]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[3]?.yValue)) : 0
    p4ratesA = typeof stowRatesRaw[5]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[5]?.yValue)) : 0

    const assignedProductMixData = document.createElement('html')
    assignedProductMixData.innerHTML = assignedProductMixRequest
    p2prodmixA = Math.round(Number(assignedProductMixData.querySelectorAll('tr')[1].children[2].innerHTML) * 100)
    p3prodmixA = Math.round(Number(assignedProductMixData.querySelectorAll('tr')[2].children[2].innerHTML) * 100)
    p4prodmixA = Math.round(Number(assignedProductMixData.querySelectorAll('tr')[3].children[2].innerHTML) * 100)
  
    p2fullnessA = Math.round(binFullness[1].yValue)
    p3fullnessA = Math.round(binFullness[3].yValue)
    p4fullnessA = Math.round(binFullness[5].yValue)

    p2fullness6A = Math.round(fullnessPerBinSize[7].yValue)
    p2fullness9A = Math.round(fullnessPerBinSize[9].yValue)
    p2fullness11A = Math.round(fullnessPerBinSize[1].yValue)
    p2fullness14A = Math.round(fullnessPerBinSize[3].yValue)
    p2fullness18A = Math.round(fullnessPerBinSize[5].yValue)
    p3fullness6A = Math.round(fullnessPerBinSize[17].yValue)
    p3fullness9A = Math.round(fullnessPerBinSize[19].yValue)
    p3fullness11A = Math.round(fullnessPerBinSize[11].yValue)
    p3fullness14A = Math.round(fullnessPerBinSize[13].yValue)
    p3fullness18A = Math.round(fullnessPerBinSize[15].yValue)
    p4fullness6A = Math.round(fullnessPerBinSize[27].yValue)
    p4fullness9A = Math.round(fullnessPerBinSize[29].yValue)
    p4fullness11A = Math.round(fullnessPerBinSize[21].yValue)
    p4fullness14A = Math.round(fullnessPerBinSize[23].yValue)
    p4fullness18A = Math.round(fullnessPerBinSize[25].yValue)

    const injection = document.createElement('html')
    p2unitsPerTote = Math.round(buffer[0].childLocations[0].works[0].containedWorks[0].quantity.count / buffer[0].childLocations[0].works[0].quantity.count)
    p3unitsPerTote = Math.round(buffer[1].childLocations[0].works[0].containedWorks[0].quantity.count / buffer[1].childLocations[0].works[0].quantity.count)
    p4unitsPerTote = Math.round(buffer[2].childLocations[0].works[0].containedWorks[0].quantity.count / buffer[2].childLocations[0].works[0].quantity.count)
    unitsPerTote = Math.round((buffer[0].childLocations[0].works[0].containedWorks[0].quantity.count + buffer[1].childLocations[0].works[0].containedWorks[0].quantity.count + buffer[2].childLocations[0].works[0].containedWorks[0].quantity.count) / (buffer[0].childLocations[0].works[0].quantity.count + buffer[1].childLocations[0].works[0].quantity.count + buffer[2].childLocations[0].works[0].quantity.count))
    injection.innerHTML = injectionData
    p2injection = Math.round(injection.querySelectorAll('tr')[3].children[injection.querySelectorAll('tr')[3].children.length - 1].innerHTML) * 12 *p2unitsPerTote
    p3injection = Math.round(injection.querySelectorAll('tr')[2].children[injection.querySelectorAll('tr')[2].children.length - 1].innerHTML) * 12 * p3unitsPerTote
    p4injection = Math.round(injection.querySelectorAll('tr')[1].children[injection.querySelectorAll('tr')[1].children.length - 1].innerHTML) * 12 * p4unitsPerTote
    totalInjection = (p2injection + p3injection + p4injection)

    const recirc = document.createElement('html')
    recirc.innerHTML = recircData
    recircTimeStamps = Array.from(recirc.querySelectorAll('th'))
    recircTimeStamps = recircTimeStamps.slice(4, recircTimeStamps.length)
    recircTimeStamps = recircTimeStamps.map(timeStamp => timeStamp.childNodes[2].data)
    recircValues = Array.from(recirc.querySelectorAll('td'))
    recircValues = recircValues.slice(4, recircValues.length)
    recircValues = recircValues.map(value => Math.round(value.innerHTML))

    const p2LineFullness = document.createElement('html')
    p2LineFullness.innerHTML = p2LineFullnessData
    p2LineFullnessValues = Array.from(p2LineFullness.querySelectorAll('td'))
    p2LineFullnessValues = p2LineFullnessValues.slice(4, p2LineFullnessData.length)
    p2LineFullnessValues = p2LineFullnessValues.map(value => Math.floor(value.innerHTML))

    const p3LineFullness = document.createElement('html')
    p3LineFullness.innerHTML = p3LineFullnessData
    p3LineFullnessValues = Array.from(p3LineFullness.querySelectorAll('td'))
    p3LineFullnessValues = p3LineFullnessValues.slice(4, p3LineFullnessData.length)
    p3LineFullnessValues = p3LineFullnessValues.map(value => Math.floor(value.innerHTML))

    const p4LineFullness = document.createElement('html')
    p4LineFullness.innerHTML = p4LineFullnessData
    p4LineFullnessValues = Array.from(p4LineFullness.querySelectorAll('td'))
    p4LineFullnessValues = p4LineFullnessValues.slice(4, p4LineFullnessData.length)
    p4LineFullnessValues = p4LineFullnessValues.map(value => Math.floor(value.innerHTML))

    totalConsumption = p2consumption + p3consumption + p4consumption
    totalBuffer = bufferP2[0].data['unit-count'] + bufferP3[0].data['unit-count'] + bufferP4[0].data['unit-count']
    bufferInHours = Math.round((totalBuffer / totalConsumption) * 10) / 10
    //totalInjection = totalConsumption + (((bufferP2[0].data['unit-count'] - bufferP2[6].data['unit-count']) + (bufferP3[0].data['unit-count'] - bufferP3[6].data['unit-count']) + (bufferP4[0].data['unit-count'] - bufferP4[6].data['unit-count'])) * 2)
    totalDelta = Number(p2delta) + Number(p3delta) + Number(p4delta)

    //create main container
    loadingElement.style.display = 'none'
    const container = document.createElement('div')
    container.setAttribute('id', 'main-container')
    document.getElementsByTagName('body')[0].appendChild(container)
    container.style.backgroundColor = '#f5f5f5'
    container.style.maxWidth = '1000px'
    container.style.minWidth = '900px'
    container.style.margin = '15px auto 0 auto'

    //create capacity table
    const capacityTable = document.createElement('table')
    container.appendChild(capacityTable)
    capacityTable.style.width = '100%'
    const tableHeaders = ['', 'P2', 'P3', 'P4', 'Total']
    for (let header of tableHeaders) {
        const tableHeaderElement = document.createElement('th')
        capacityTable.appendChild(tableHeaderElement)
        tableHeaderElement.innerHTML = header
        tableHeaderElement.style.border = '1px solid #C1C1C1'
        tableHeaderElement.style.borderCollapse = 'collapse'
        tableHeaderElement.style.width = '20%'
        tableHeaderElement.style.backgroundColor = '#C1C1C1'
        tableHeaderElement.style.color = 'white'
        if (header == tableHeaders[tableHeaders.length - 1]) {
            tableHeaderElement.style.backgroundColor = '#A1A1A1'
        }
    }

    const metricsGeneral = [{metric: 'Headcount', id: 'headcount', p2: p2headcount, p3: p3headcount, p4: p4headcount, total: totalHeadcount}, {metric: 'Rates', id: 'rates', p2: p2rate, p3: p3rate, p4: p4rate, total: totalRates}, {metric: 'Hourly Consumption', id: 'consumption', p2: p2consumption.toLocaleString(), p3: p3consumption.toLocaleString(), p4: p4consumption.toLocaleString(), total: totalConsumption.toLocaleString()}, {metric: 'Hourly Injection', id: 'injection', p2: p2injection.toLocaleString(), p3: p3injection.toLocaleString(), p4: p4injection.toLocaleString(), total: totalInjection.toLocaleString()}]
    for (let metric of metricsGeneral) {
        const metricRow = document.createElement('tr')
        capacityTable.appendChild(metricRow)
        metricRow.innerHTML = `<td class="metric">${metric.metric}</td><td id="p2${metric.id}" class="table-data">${metric.p2}</td><td id="p3${metric.id}" class="table-data">${metric.p3}</td><td id="p4${metric.id}" class="table-data">${metric.p4}</td><td id="total${metric.id}" class="table-data-total">${metric.total}</td>`
    }

    //create buffer table
    const bufferTable = document.createElement('table')
    container.appendChild(bufferTable)
    bufferTable.style.width = '100%'
    bufferTable.style.marginTop = '3em'
    for (let header of tableHeaders) {
        const tableHeaderElement = document.createElement('th')
        bufferTable.appendChild(tableHeaderElement)
        tableHeaderElement.innerHTML = header
        tableHeaderElement.style.border = '1px solid #C1C1C1'
        tableHeaderElement.style.borderCollapse = 'collapse'
        tableHeaderElement.style.width = '20%'
        tableHeaderElement.style.backgroundColor = '#C1C1C1'
        tableHeaderElement.style.color = 'white'
        if (header == tableHeaders[tableHeaders.length - 1]) {
            tableHeaderElement.style.backgroundColor = '#A1A1A1'
        }
    }
    const metricsBuffer = [{metric: 'Units Per Tote', id: 'unitPerTote', p2: p2unitsPerTote, p3: p3unitsPerTote, p4: p4unitsPerTote, total: unitsPerTote}, {metric: '2 Hours Buffer +20%', id: 'bufferplus', p2: p2bufferplus.toLocaleString(), p3: p3bufferplus.toLocaleString(), p4: p4bufferplus.toLocaleString(), total: totalBufferPlus.toLocaleString()}, {metric: '2 Hours Buffer -20%', id: 'bufferminus', p2: p2bufferminus.toLocaleString(), p3: p3bufferminus.toLocaleString(), p4: p4bufferminus.toLocaleString(), total: totalBufferMinus.toLocaleString()}, {metric: 'Current Buffer', id: 'buffer', p2: p2buffer.toLocaleString(), p3: p3buffer.toLocaleString(), p4: p4buffer.toLocaleString(), total: totalBuffer.toLocaleString()}, {metric: `${bufferExpInHours} Hours Buffer Delta`, id: 'delta', p2: p2delta.toLocaleString(), p3: p3delta.toLocaleString(), p4: p4delta.toLocaleString(), total: totalDelta.toLocaleString()}]
    for (let metric of metricsBuffer) {
        const metricRow = document.createElement('tr')
        bufferTable.appendChild(metricRow)
        metricRow.innerHTML = `<td class="metric">${metric.metric}</td><td id="p2${metric.id}" class="table-data">${metric.p2}</td><td id="p3${metric.id}" class="table-data">${metric.p3}</td><td id="p4${metric.id}" class="table-data">${metric.p4}</td><td id="total${metric.id}" class="table-data-total">${metric.total}</td>`
    }

    //container for grafs
    const grafsContainer = document.createElement('div')
    container.appendChild(grafsContainer)
    grafsContainer.style.marginTop = '3em'
    const mainGraf = document.createElement('canvas')
    grafsContainer.appendChild(mainGraf)
    mainGraf.setAttribute('id', 'main-graf')
    const recircGraf = document.createElement('canvas')
    grafsContainer.appendChild(recircGraf)
    recircGraf.setAttribute('id', 'recirc-graf')


    //create other metrics table
    const otherMetricsTable = document.createElement('table')
    container.appendChild(otherMetricsTable)
    otherMetricsTable.style.width = '100%'
    otherMetricsTable.style.marginTop = '3em'
    const othersTableHeaders = ['', 'P2A','P3A','P4A']
    for (let header of othersTableHeaders) {
        const tableHeaderElement = document.createElement('th')
        otherMetricsTable.appendChild(tableHeaderElement)
        tableHeaderElement.innerHTML = header
        tableHeaderElement.style.border = '1px solid #C1C1C1'
        tableHeaderElement.style.borderCollapse = 'collapse'
        tableHeaderElement.style.backgroundColor = '#C1C1C1'
        tableHeaderElement.style.color = 'white'
        if (header == othersTableHeaders[0]) {
           tableHeaderElement.colSpan = 2
            tableHeaderElement.style.width = '25%'
        }
    }
    const otherMetrics = [{metric: 'Headcount', id: 'headcount', p2A: p2headcountA, p3A: p3headcountA, p4A: p4headcountA},
                         {metric: 'Rates', id: 'rates', p2A: p2ratesA, p3A: p3ratesA, p4A: p4ratesA},
                         {metric: 'Product Mix - Smalls', id: 'productmix', p2A:`${p2prodmixA}%`, p3A: `${p3prodmixA}%`, p4A:`${p4prodmixA}%`},
                         {metric: 'Bin Fullness', id: 'binfullness', p2A:`${p2fullnessA}%`, p3A: `${p3fullnessA}%`, p4A:`${p4fullnessA}%`},
                         {metric: 'Fullness 6"', id: 'fullness6', p2A:`${p2fullness6A}%`, p3A: `${p3fullness6A}%`, p4A:`${p4fullness6A}%`},
                         {metric: 'Fullness 9"', id: 'fullness9', p2A:`${p2fullness9A}%`, p3A: `${p3fullness9A}%`, p4A:`${p4fullness9A}%`},
                        {metric: 'Fullness 11"', id: 'fullness11', p2A:`${p2fullness11A}%`, p3A: `${p3fullness11A}%`, p4A:`${p4fullness11A}%`},
                         {metric: 'Fullness 14"', id: 'fullness14', p2A:`${p2fullness14A}%`, p3A: `${p3fullness14A}%`, p4A:`${p4fullness14A}%`},
                         {metric: 'Fullness 18.5"', id: 'fullness18', p2A:`${p2fullness18A}%`, p3A: `${p3fullness18A}%`, p4A:`${p4fullness18A}%`}]
    for (let metric of otherMetrics) {
        const metricRow = document.createElement('tr')
        metricRow.setAttribute('id', metric.id)
        otherMetricsTable.appendChild(metricRow)
         metricRow.innerHTML = `<td colspan='2' class="metric">${metric.metric}</td><td id="p2A${metric.id}" class="table-data">${metric.p2A}</td><td id="p3A${metric.id}" class="table-data">${metric.p3A}</td><td id="p4A${metric.id}" class="table-data">${metric.p4A}</td>`
    }

    const metricsClass = document.getElementsByClassName('metric')
    for (let metric of metricsClass) {
        metric.style.border = '1px solid #C1C1C1'
        metric.style.borderCollapse = 'collapse'
        metric.style.color = '#1a1a1a'
        metric.style.fontWeight = '500'
    }
    const dataCells = document.getElementsByClassName('table-data')
    for (let dataCell of dataCells) {
        dataCell.style.border = '1px solid #C1C1C1'
        dataCell.style.borderCollapse = 'collapse'
        dataCell.style.textAlign = 'right'
        dataCell.style.color = '#404040'
    }
    const dataCellsTotal = document.getElementsByClassName('table-data-total')
    for (let dataTotal of dataCellsTotal) {
        dataTotal.style.border = '1px solid #C1C1C1'
        dataTotal.style.borderCollapse = 'collapse'
        dataTotal.style.textAlign = 'right'
        dataTotal.style.color = '#404040'
        dataTotal.style.fontWeight = '500'
        dataTotal.style.backgroundColor = 'rgb(230, 230, 230)'
    }
    document.getElementById('binfullness').style.backgroundColor = 'rgb(210, 210, 210)'
    document.getElementById('fullness6').style.backgroundColor = 'rgb(210, 210, 210)'
    document.getElementById('fullness9').style.backgroundColor = 'rgb(210, 210, 210)'
    document.getElementById('fullness11').style.backgroundColor = 'rgb(210, 210, 210)'
    document.getElementById('fullness14').style.backgroundColor = 'rgb(210, 210, 210)'
    document.getElementById('fullness18').style.backgroundColor = 'rgb(210, 210, 210)'



    //main graf
    for (let i = 0; i <= 136; i++) {
        let unitCount = bufferP2[i].data['unit-count'] + bufferP3[i].data['unit-count'] + bufferP4[i].data['unit-count']
        let date = new Date(bufferP2[i].timestamp).toLocaleTimeString([], {timeStyle: 'short'})
        let bufferValuesPlusData = Math.round(((bufferP2[i].data['employee-count'] + bufferP3[i].data['employee-count'] + bufferP4[i].data['employee-count']) * (((p2rate * (p2hoursA)) + (p3rate * (p3hoursA)) + (p4rate * (p4hoursA))) / ((p2hoursA) + (p3hoursA) + (p4hoursA))) * bufferExpInHours) + (((bufferP2[i].data['employee-count'] + bufferP3[i].data['employee-count'] + bufferP4[i].data['employee-count']) * (((p2rate * (p2hoursA)) + (p3rate * (p3hoursA)) + (p4rate * (p4hoursA))) / ((p2hoursA) + (p3hoursA) + (p4hoursA))) * bufferExpInHours) * 20 / 100))
        let bufferValuesMinusData = Math.round(((bufferP2[i].data['employee-count'] + bufferP3[i].data['employee-count'] + bufferP4[i].data['employee-count']) * (((p2rate * (p2hoursA)) + (p3rate * (p3hoursA)) + (p4rate * (p4hoursA))) / ((p2hoursA) + (p3hoursA) + (p4hoursA))) * bufferExpInHours) - (((bufferP2[i].data['employee-count'] + bufferP3[i].data['employee-count'] + bufferP4[i].data['employee-count']) * (((p2rate * (p2hoursA)) + (p3rate * (p3hoursA)) + (p4rate * (p4hoursA))) / ((p2hoursA) + (p3hoursA) + (p4hoursA))) * bufferExpInHours) * 20 / 100))

        labels.unshift(date)
        bufferValues.unshift(unitCount)
        bufferValuesPlus.unshift(bufferValuesPlusData)
        bufferValuesMinus.unshift(bufferValuesMinusData)
        unitCount > bufferValuesMinusData && unitCount < bufferValuesPlusData ? colors.unshift('rgb(54, 201, 54)') : colors.unshift('rgb(255,0,0)')
    }


mainChart = new Chart("main-graf", {
  type: 'line',
  data: {
   labels: labels,
    datasets: [{
      pointRadius: 4,
      label: "Actual Buffer",
      pointBackgroundColor: colors,
      data: bufferValues,
      segment: {borderColor: (ctx) => colors[ctx.p0DataIndex]}
    }, {
      pointRadius: 4,
      label: "Buffer Maximum",
      pointBackgroundColor: "rgb(190, 190, 190)",
      borderColor: "rgb(190, 190, 190)",
      backgroundColor:"rgba(0,255,0, 0)",
      data: bufferValuesPlus
    }, {
      pointRadius: 4,
      label: "Buffer Minimum",
      pointBackgroundColor: "rgb(190, 190, 190)",
      borderColor: "rgb(190, 190, 190)",
      backgroundColor:"rgba(255,0,0, 0)",
      data: bufferValuesMinus
    }]
  },
  options: {
    plugins: {
        title: {display: true, text: 'Stow Buffer Last 12 Hours', position: 'top', font: {size: 25}},
        legend: {display: false}
    },
    scales: {
      y: {min: 0, max: 160000},
    },
    animations: {
        tension: {duration: 2000}
      }
  }
});

recircChart = new Chart('recirc-graf', {
    type: 'line',
    data: {
        labels: recircTimeStamps,
        datasets: [
            {
                label: '% Recirc',
                pointRadius: 2,
                pointBackgroundColor: "blue",
                data: recircValues,
                borderColor: 'blue',
                borderWidth: 4
            },
            {
                label: 'P2 Missed Divert',
                data: p2LineFullnessValues,
                borderColor: 'rgba(125, 0, 125, 0.3)',
                hoverBorderColor: 'rgba(125, 0, 125, 1)'
            },
            {
                label: 'P3 Missed Divert',
                data: p3LineFullnessValues,
                borderColor: 'rgba(255, 0, 0, 0.3)'
            },
            {
                label: 'P4 Missed Divert',
                data: p4LineFullnessValues,
                borderColor: 'rgba(220, 140, 0, 0.3)'
            }
        ]
    },
    options: {
        plugins: {
            title: {display: true, text: '% Recirc Last 12 Hours', position: 'top', font: {size: 25}}
        },
        scales: {
            y: {
                ticks: {
                    stepSize: 10,
                }
            }
        }
    }
});


    style(p2buffer, p2delta, p3buffer, p3delta, p4buffer, p4delta, totalBuffer, totalDelta, p2headcount, p3headcount, p4headcount, totalHeadcount, p2rate, p3rate, p4rate, totalRates)
    refreshData()
    }
    catch(error)
    {
        loadingElement.innerHTML = 'Couldn\'t access the data.'
        console.log(error)
    }
}

//keep refreshing data
function refreshData() {
    setInterval(async function() {
        setTimeAndShift()

        let stowRatesRaw = await getStowRate()
        let workedHours = await getWorkedHours()
        let currentHeadcount = await getCurrentHeadcount()
        let bufferP2 = await getBufferP2()
        let bufferP3 = await getBufferP3()
        let bufferP4 = await getBufferP4()
        let assignedProductMixRequest = await getAssignedProductMix()
        let binFullness = await getBinFullness()
        let unitsStowed = await getUnitsStowed()
        let injectionData = await getInjection()
        let fullnessPerBinSize = await getBinFullnessBinSize()
        let buffer = await getBuffer()
        let recircData = await getRecirc()
        let p2LineFullnessData = await getP2LineFullness()
        let p3LineFullnessData = await getP3LineFullness()
        let p4LineFullnessData = await getP4LineFullness()

    p2headcount = (typeof currentHeadcount[7]?.yValue != 'undefined' ? Number(currentHeadcount[7]?.yValue) : 0) + (typeof currentHeadcount[58]?.yValue != 'undefined' ? Number(currentHeadcount[58]?.yValue) : 0)
    p3headcount = (typeof currentHeadcount[24]?.yValue != 'undefined' ? Number(currentHeadcount[24]?.yValue) : 0) + (typeof currentHeadcount[75]?.yValue != 'undefined' ? Number(currentHeadcount[75]?.yValue) : 0)
    p4headcount = (typeof currentHeadcount[41]?.yValue != 'undefined' ? Number(currentHeadcount[41]?.yValue) : 0) + (typeof currentHeadcount[92]?.yValue != 'undefined' ? Number(currentHeadcount[92]?.yValue) : 0)
    totalHeadcount = (p2headcount + p3headcount + p4headcount) || 0
    p2hoursA = (typeof workedHours[1]?.yValue != 'undefined' ? Math.round(workedHours[1]?.yValue) : 0)
    p3hoursA = (typeof workedHours[3]?.yValue != 'undefined' ? Math.round(workedHours[3]?.yValue) : 0)
    p4hoursA = (typeof workedHours[5]?.yValue != 'undefined' ? Math.round(workedHours[5]?.yValue) : 0)
    p2rate = Math.round((((typeof stowRatesRaw[1]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[1]?.yValue)) : 0) * p2hoursA) + ((typeof stowRatesRaw[7]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[7]?.yValue)) : 0))) / (p2hoursA)) || 0
    p3rate = Math.round((((typeof stowRatesRaw[3]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[3]?.yValue)) : 0) * p3hoursA) + ((typeof stowRatesRaw[9]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[9]?.yValue)) : 0))) / (p3hoursA)) || 0
    p4rate = Math.round((((typeof stowRatesRaw[5]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[5]?.yValue)) : 0) * p4hoursA) + ((typeof stowRatesRaw[11]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[11]?.yValue)) : 0))) / (p4hoursA)) || 0
    totalRates = Math.round(((p2rate * (p2hoursA)) + (p3rate * (p3hoursA)) + (p4rate * (p4hoursA))) / ((p2hoursA) + (p3hoursA) + (p4hoursA))) || 0
    p2consumption = p2headcount * p2rate
    p3consumption = p3headcount * p3rate
    p4consumption = p4headcount * p4rate
    p2bufferplus = Math.round((p2headcount * p2rate * bufferExpInHours) + (p2headcount * p2rate * bufferExpInHours) * 20 / 100)
    p3bufferplus = Math.round((p3headcount * p3rate * bufferExpInHours) + (p3headcount * p3rate * bufferExpInHours) * 20 / 100)
    p4bufferplus = Math.round((p4headcount * p4rate * bufferExpInHours) + (p4headcount * p4rate * bufferExpInHours) * 20 / 100)
    p2bufferminus = Math.round((p2headcount * p2rate * bufferExpInHours) - (p2headcount * p2rate * bufferExpInHours) * 20 / 100)
    p3bufferminus = Math.round((p3headcount * p3rate * bufferExpInHours) - (p3headcount * p3rate * bufferExpInHours) * 20 / 100)
    p4bufferminus = Math.round((p4headcount * p4rate * bufferExpInHours) - (p4headcount * p4rate * bufferExpInHours) * 20 / 100)
    totalBufferPlus = p2bufferplus + p3bufferplus + p4bufferplus
    totalBufferMinus = p2bufferminus + p3bufferminus + p4bufferminus
   p2buffer = bufferP2[0].data['unit-count']
    p3buffer = bufferP3[0].data['unit-count']
    p4buffer = bufferP4[0].data['unit-count']
    p2delta = Math.floor((bufferP2[0].data['unit-count'] - (p2headcount * p2rate * bufferExpInHours)))
    p3delta = Math.floor((bufferP3[0].data['unit-count'] - (p3headcount * p3rate * bufferExpInHours)))
    p4delta = Math.floor((bufferP4[0].data['unit-count'] - (p4headcount * p4rate * bufferExpInHours)))
    p2headcountA = Number(typeof currentHeadcount[7]?.yValue != 'undefined' ? Number(currentHeadcount[7]?.yValue) : 0)
    p3headcountA = Number(typeof currentHeadcount[24]?.yValue != 'undefined' ? Number(currentHeadcount[24]?.yValue) : 0)
    p4headcountA = Number(typeof currentHeadcount[41]?.yValue != 'undefined' ? Number(currentHeadcount[41]?.yValue) : 0)
    p2ratesA = typeof stowRatesRaw[1]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[1]?.yValue)) : 0
    p3ratesA = typeof stowRatesRaw[3]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[3]?.yValue)) : 0
    p4ratesA = typeof stowRatesRaw[5]?.yValue != 'undefined' ? (Math.round(stowRatesRaw[5]?.yValue)) : 0

    const assignedProductMixData = document.createElement('html')
    assignedProductMixData.innerHTML = assignedProductMixRequest
    p2prodmixA = Math.round(Number(assignedProductMixData.querySelectorAll('tr')[1].children[2].innerHTML) * 100)
    p3prodmixA = Math.round(Number(assignedProductMixData.querySelectorAll('tr')[2].children[2].innerHTML) * 100)
    p4prodmixA = Math.round(Number(assignedProductMixData.querySelectorAll('tr')[3].children[2].innerHTML) * 100)

    p2fullnessA = Math.round(binFullness[1].yValue)
    p3fullnessA = Math.round(binFullness[3].yValue)
    p4fullnessA = Math.round(binFullness[5].yValue)

    p2fullness6A = Math.round(fullnessPerBinSize[7].yValue)
    p2fullness9A = Math.round(fullnessPerBinSize[9].yValue)
    p2fullness11A = Math.round(fullnessPerBinSize[1].yValue)
    p2fullness14A = Math.round(fullnessPerBinSize[3].yValue)
    p2fullness18A = Math.round(fullnessPerBinSize[5].yValue)
    p3fullness6A = Math.round(fullnessPerBinSize[17].yValue)
    p3fullness9A = Math.round(fullnessPerBinSize[19].yValue)
    p3fullness11A = Math.round(fullnessPerBinSize[11].yValue)
    p3fullness14A = Math.round(fullnessPerBinSize[13].yValue)
    p3fullness18A = Math.round(fullnessPerBinSize[15].yValue)
    p4fullness6A = Math.round(fullnessPerBinSize[27].yValue)
    p4fullness9A = Math.round(fullnessPerBinSize[29].yValue)
    p4fullness11A = Math.round(fullnessPerBinSize[21].yValue)
    p4fullness14A = Math.round(fullnessPerBinSize[23].yValue)
    p4fullness18A = Math.round(fullnessPerBinSize[25].yValue)



    const injection = document.createElement('html')
    p2unitsPerTote = Math.round(buffer[0].childLocations[0].works[0].containedWorks[0].quantity.count / buffer[0].childLocations[0].works[0].quantity.count)
    p3unitsPerTote = Math.round(buffer[1].childLocations[0].works[0].containedWorks[0].quantity.count / buffer[1].childLocations[0].works[0].quantity.count)
    p4unitsPerTote = Math.round(buffer[2].childLocations[0].works[0].containedWorks[0].quantity.count / buffer[2].childLocations[0].works[0].quantity.count)
    unitsPerTote = Math.round((buffer[0].childLocations[0].works[0].containedWorks[0].quantity.count + buffer[1].childLocations[0].works[0].containedWorks[0].quantity.count + buffer[2].childLocations[0].works[0].containedWorks[0].quantity.count) / (buffer[0].childLocations[0].works[0].quantity.count + buffer[1].childLocations[0].works[0].quantity.count + buffer[2].childLocations[0].works[0].quantity.count))

    injection.innerHTML = injectionData
    p2injection = Math.round(injection.querySelectorAll('tr')[3].children[injection.querySelectorAll('tr')[3].children.length - 1].innerHTML) * 12 * p2unitsPerTote
    p3injection = Math.round(injection.querySelectorAll('tr')[2].children[injection.querySelectorAll('tr')[2].children.length - 1].innerHTML) * 12 * p3unitsPerTote
    p4injection = Math.round(injection.querySelectorAll('tr')[1].children[injection.querySelectorAll('tr')[1].children.length - 1].innerHTML) * 12 * p4unitsPerTote
    totalInjection = (p2injection + p3injection + p4injection)

    const recirc = document.createElement('html')
    recirc.innerHTML = recircData
    recircTimeStamps = Array.from(recirc.querySelectorAll('th'))
    recircTimeStamps = recircTimeStamps.slice(4, recircTimeStamps.length)
    recircTimeStamps = recircTimeStamps.map(timeStamp => timeStamp.childNodes[2].data)
    recircValues = Array.from(recirc.querySelectorAll('td'))
    recircValues = recircValues.slice(4, recircValues.length)
    recircValues = recircValues.map(value => Math.round(value.innerHTML))

    const p2LineFullness = document.createElement('html')
    p2LineFullness.innerHTML = p2LineFullnessData
    p2LineFullnessValues = Array.from(p2LineFullness.querySelectorAll('td'))
    p2LineFullnessValues = p2LineFullnessValues.slice(4, p2LineFullnessData.length)
    p2LineFullnessValues = p2LineFullnessValues.map(value => Math.floor(value.innerHTML))

    const p3LineFullness = document.createElement('html')
    p3LineFullness.innerHTML = p3LineFullnessData
    p3LineFullnessValues = Array.from(p3LineFullness.querySelectorAll('td'))
    p3LineFullnessValues = p3LineFullnessValues.slice(4, p3LineFullnessData.length)
    p3LineFullnessValues = p3LineFullnessValues.map(value => Math.floor(value.innerHTML))

    const p4LineFullness = document.createElement('html')
    p4LineFullness.innerHTML = p4LineFullnessData
    p4LineFullnessValues = Array.from(p4LineFullness.querySelectorAll('td'))
    p4LineFullnessValues = p4LineFullnessValues.slice(4, p4LineFullnessData.length)
    p4LineFullnessValues = p4LineFullnessValues.map(value => Math.floor(value.innerHTML))

    totalConsumption = p2consumption + p3consumption + p4consumption
    totalBuffer = bufferP2[0].data['unit-count'] + bufferP3[0].data['unit-count'] + bufferP4[0].data['unit-count']
    bufferInHours = Math.round((totalBuffer / totalConsumption) * 10) / 10
    //totalInjection = totalConsumption + (((bufferP2[0].data['unit-count'] - bufferP2[6].data['unit-count']) + (bufferP3[0].data['unit-count'] - bufferP3[6].data['unit-count']) + (bufferP4[0].data['unit-count'] - bufferP4[6].data['unit-count'])) * 2)
    totalDelta = Number(p2delta) + Number(p3delta) + Number(p4delta)

    document.getElementById('p2headcount').innerHTML = p2headcount
    document.getElementById('p3headcount').innerHTML = p3headcount
    document.getElementById('p4headcount').innerHTML = p4headcount
    document.getElementById('p2rates').innerHTML = p2rate
    document.getElementById('p3rates').innerHTML = p3rate
    document.getElementById('p4rates').innerHTML = p4rate
    document.getElementById('p2consumption').innerHTML = p2consumption.toLocaleString()
    document.getElementById('p3consumption').innerHTML = p3consumption.toLocaleString()
    document.getElementById('p4consumption').innerHTML = p4consumption.toLocaleString()
    document.getElementById('p2bufferplus').innerHTML = p2bufferplus.toLocaleString()
    document.getElementById('p3bufferplus').innerHTML = p3bufferplus.toLocaleString()
    document.getElementById('p4bufferplus').innerHTML = p4bufferplus.toLocaleString()
    document.getElementById('p2bufferminus').innerHTML = p2bufferminus.toLocaleString()
    document.getElementById('p3bufferminus').innerHTML = p3bufferminus.toLocaleString()
    document.getElementById('p4bufferminus').innerHTML = p4bufferminus.toLocaleString()
    document.getElementById('p2buffer').innerHTML = p2buffer.toLocaleString()
    document.getElementById('p3buffer').innerHTML = p3buffer.toLocaleString()
    document.getElementById('p4buffer').innerHTML = p4buffer.toLocaleString()
    document.getElementById('p2delta').innerHTML = p2delta.toLocaleString()
    document.getElementById('p3delta').innerHTML = p3delta.toLocaleString()
    document.getElementById('p4delta').innerHTML = p4delta.toLocaleString()
    document.getElementById('p2Aheadcount').innerHTML = p2headcountA
    document.getElementById('p3Aheadcount').innerHTML = p3headcountA
    document.getElementById('p4Aheadcount').innerHTML = p4headcountA
    document.getElementById('p2Arates').innerHTML = p2ratesA
    document.getElementById('p3Arates').innerHTML = p3ratesA
    document.getElementById('p4Arates').innerHTML = p4ratesA
    document.getElementById('p2Aproductmix').innerHTML = p2prodmixA + "%"
    document.getElementById('p3Aproductmix').innerHTML = p3prodmixA + "%"
    document.getElementById('p4Aproductmix').innerHTML = p4prodmixA + "%"
    document.getElementById('p2Abinfullness').innerHTML = p2fullnessA + "%"
    document.getElementById('p3Abinfullness').innerHTML = p3fullnessA + "%"
    document.getElementById('p4Abinfullness').innerHTML = p4fullnessA + "%"
    document.getElementById('p2Afullness6').innerHTML = p2fullness6A + "%"
    document.getElementById('p2Afullness9').innerHTML = p2fullness9A + "%"
    document.getElementById('p2Afullness11').innerHTML = p2fullness11A + "%"
    document.getElementById('p2Afullness14').innerHTML = p2fullness14A + "%"
    document.getElementById('p2Afullness18').innerHTML = p2fullness18A + "%"
    document.getElementById('p3Afullness6').innerHTML = p3fullness6A + "%"
    document.getElementById('p3Afullness9').innerHTML = p3fullness9A + "%"
    document.getElementById('p3Afullness11').innerHTML = p3fullness11A + "%"
    document.getElementById('p3Afullness14').innerHTML = p3fullness14A + "%"
    document.getElementById('p3Afullness18').innerHTML = p3fullness18A + "%"
    document.getElementById('p4Afullness6').innerHTML = p4fullness6A + "%"
    document.getElementById('p4Afullness9').innerHTML = p4fullness9A + "%"
    document.getElementById('p4Afullness11').innerHTML = p4fullness11A + "%"
    document.getElementById('p4Afullness14').innerHTML = p4fullness14A + "%"
    document.getElementById('p4Afullness18').innerHTML = p4fullness18A + "%"
    document.getElementById('p2injection').innerHTML = p2injection.toLocaleString()
    document.getElementById('p3injection').innerHTML = p3injection.toLocaleString()
    document.getElementById('p4injection').innerHTML = p4injection.toLocaleString()
    document.getElementById('totalheadcount').innerHTML = totalHeadcount
    document.getElementById('totalrates').innerHTML = totalRates
    document.getElementById('totalconsumption').innerHTML = totalConsumption.toLocaleString()
    document.getElementById('totalbuffer').innerHTML = totalBuffer.toLocaleString()
    document.getElementById('totalinjection').innerHTML = totalInjection.toLocaleString()
    document.getElementById('totaldelta').innerHTML = totalDelta.toLocaleString()
    document.getElementById('totalbufferplus').innerHTML = totalBufferPlus.toLocaleString()
    document.getElementById('totalbufferminus').innerHTML = totalBufferMinus.toLocaleString()
    document.getElementById('p2unitPerTote').innerHTML = p2unitsPerTote
    document.getElementById('p3unitPerTote').innerHTML = p3unitsPerTote
    document.getElementById('p4unitPerTote').innerHTML = p4unitsPerTote
    document.getElementById('totalunitPerTote').innerHTML = unitsPerTote


        //main graf
    bufferValues = [];
    labels = []
    bufferValuesPlus = []
    bufferValuesMinus = []
    colors = []
    for (let i = 0; i <= 136; i++) {
        let unitCount = bufferP2[i].data['unit-count'] + bufferP3[i].data['unit-count'] + bufferP4[i].data['unit-count']
        let date = new Date(bufferP2[i].timestamp).toLocaleTimeString([], {timeStyle: 'short'})
        let bufferValuesPlusData = Math.round(((bufferP2[i].data['employee-count'] + bufferP3[i].data['employee-count'] + bufferP4[i].data['employee-count']) * (((p2rate * (p2hoursA)) + (p3rate * (p3hoursA)) + (p4rate * (p4hoursA))) / ((p2hoursA) + (p3hoursA) + (p4hoursA))) * bufferExpInHours) + (((bufferP2[i].data['employee-count'] + bufferP3[i].data['employee-count'] + bufferP4[i].data['employee-count']) * (((p2rate * (p2hoursA)) + (p3rate * (p3hoursA)) + (p4rate * (p4hoursA))) / ((p2hoursA) + (p3hoursA) + (p4hoursA))) * bufferExpInHours) * 20 / 100))
        let bufferValuesMinusData = Math.round(((bufferP2[i].data['employee-count'] + bufferP3[i].data['employee-count'] + bufferP4[i].data['employee-count']) * (((p2rate * (p2hoursA)) + (p3rate * (p3hoursA)) + (p4rate * (p4hoursA))) / ((p2hoursA) + (p3hoursA) + (p4hoursA))) * bufferExpInHours) - (((bufferP2[i].data['employee-count'] + bufferP3[i].data['employee-count'] + bufferP4[i].data['employee-count']) * (((p2rate * (p2hoursA)) + (p3rate * (p3hoursA)) + (p4rate * (p4hoursA))) / ((p2hoursA) + (p3hoursA) + (p4hoursA))) * bufferExpInHours) * 20 / 100))
        labels.unshift(date)
        bufferValues.unshift(unitCount)
        bufferValuesPlus.unshift(bufferValuesPlusData)
        bufferValuesMinus.unshift(bufferValuesMinusData)
        unitCount > bufferValuesMinusData && unitCount < bufferValuesPlusData ? colors.unshift('rgb(54, 201, 54)') : colors.unshift('rgb(255,0,0)')
    }
        mainChart.data.labels = labels
        mainChart.data.datasets[0].data = bufferValues
        mainChart.data.datasets[1].data = bufferValuesPlus
        mainChart.data.datasets[2].data = bufferValuesMinus
        mainChart.data.datasets[0].pointBackgroundColor = colors
        mainChart.data.datasets[0].segment = {borderColor: (ctx) => colors[ctx.p0DataIndex]}
        mainChart.update()

        recircChart.data.labels = recircTimeStamps
        recircChart.data.datasets[0].data = recircValues
        recircChart.data.datasets[1].data = p2LineFullnessValues
        recircChart.data.datasets[2].data = p3LineFullnessValues
        recircChart.data.datasets[3].data = p4LineFullnessValues
        recircChart.update()

        style(p2buffer, p2delta, p3buffer, p3delta, p4buffer, p4delta, totalBuffer, totalDelta, p2headcount, p3headcount, p4headcount, totalHeadcount, p2rate, p3rate, p4rate, totalRates)
    }, 120000)
}

///////////////empty stations page
async function emptyStationsPage() {
    flowControl.setAttribute('href', 'https://inbound-flow-control.amazon.com/powerup/MAN1/')
    diveDeep.setAttribute('href', 'https://inbound-flow-control.amazon.com/powerup/MAN1/divedeep')
    flowControl.style.color = 'black'
    diveDeep.style.color = 'black'
    emptyStations.style.color = 'rgb(255, 0, 0)'
    emptyStations.style.fontWeight = 'bold'

    try
    {
    let p2Astations = await getp2AStations()
    let p3Astations = await getp3AStations()
    let p4Astations = await getp4AStations()
    let p2AstationsTaken = await getp2AStationsTaken()
    let p3AstationsTaken = await getp3AStationsTaken()
    let p4AstationsTaken = await getp4AStationsTaken()
   

    let emptyStationsP2A = p2Astations.filter(station => {
        return !p2AstationsTaken.some(takenStation => takenStation.station_id === station.id)
    })
    let emptyStationsP3A = p3Astations.filter(station => {
        return !p3AstationsTaken.some(takenStation => takenStation.station_id === station.id)
    })
    let emptyStationsP4A = p4Astations.filter(station => {
        return !p4AstationsTaken.some(takenStation => takenStation.station_id === station.id)
    })


    //create main container
    loadingElement.style.display = 'none'
    const container = document.createElement('div')
    container.setAttribute('id', 'main-container')
    document.getElementsByTagName('body')[0].appendChild(container)
    container.style.backgroundColor = '#f5f5f5'
    container.style.maxWidth = '1000px'
    container.style.minWidth = '900px'
    container.style.margin = '15px auto 0 auto'
    container.style.textAlign = 'center'

    const p2container = document.createElement('div')
    const p3container = document.createElement('div')
    const p4container = document.createElement('div')
    const p2containerA = document.createElement('div')
    const p3containerA = document.createElement('div')
    const p4containerA = document.createElement('div')
   

    container.appendChild(p2container)
    container.appendChild(p3container)
    container.appendChild(p4container)
    p2container.appendChild(p2containerA)
    p2container.appendChild(p2containerB)
    p3container.appendChild(p3containerA)
    p3container.appendChild(p3containerB)
    p4container.appendChild(p4containerA)
    p4container.appendChild(p4containerB)

    p2container.style.display = 'flex'
    p2container.style.justifyContent = 'space-around'
    p3container.style.display = 'flex'
    p3container.style.justifyContent = 'space-around'
    p4container.style.display = 'flex'
    p4container.style.justifyContent = 'space-around'
    p2containerA.style.flex = '1'
    p2containerB.style.flex = '1'
    p3containerA.style.flex = '1'
    p3containerB.style.flex = '1'
    p4containerA.style.flex = '1'
    p4containerB.style.flex = '1'

    const allFields = [{name: 'P2A', container: p2containerA, data: emptyStationsP2A}, {name: 'P2B', container: p2containerB, data: emptyStationsP2B}, {name: 'P3A', container: p3containerA, data: emptyStationsP3A}, {name: 'P3B', container: p3containerB, data: emptyStationsP3B}, {name: 'P4A', container: p4containerA, data: emptyStationsP4A}, {name: 'P4B', container: p4containerB, data: emptyStationsP4B}]

    for (let field of allFields) {
        const fieldTitle = document.createElement('div')
        field.container.appendChild(fieldTitle)
        field.container.style.border = '2px grey solid'
        fieldTitle.innerHTML = field.name
        fieldTitle.style.fontSize = '1.2em'
        fieldTitle.style.fontWeight = 'bold'
        fieldTitle.style.padding = '5px'
        fieldTitle.style.borderBottom = '1px black solid'
        const fieldInnerContainer = document.createElement('div')
        field.container.appendChild(fieldInnerContainer)
        const arsawStations = document.createElement('div')
        const nikeUniversalStations = document.createElement('div')
        const universalStations = document.createElement('div')
        fieldInnerContainer.style.display = 'flex'
        fieldInnerContainer.appendChild(arsawStations)
        fieldInnerContainer.appendChild(nikeUniversalStations)
        fieldInnerContainer.appendChild(universalStations)
        arsawStations.style.flex = '1'
        nikeUniversalStations.style.flex = '1'
        universalStations.style.flex = '1'
        const arsawStationsTitle = document.createElement('div')
        const nikeUniversalStationsTitle = document.createElement('div')
        const universalStationsTitle = document.createElement('div')
        arsawStations.appendChild(arsawStationsTitle)
        nikeUniversalStations.appendChild(nikeUniversalStationsTitle)
        universalStations.appendChild(universalStationsTitle)
        arsawStationsTitle.innerHTML = 'ARSAW'
        nikeUniversalStationsTitle.innerHTML = 'Nike Universal [IDS]'
        universalStationsTitle.innerHTML = 'Universal [HS]'
        arsawStationsTitle.style.borderBottom = '1px black solid'
        arsawStationsTitle.style.backgroundColor = 'orange'
        nikeUniversalStationsTitle.style.borderBottom = '1px black solid'
        nikeUniversalStationsTitle.style.backgroundColor = 'lightblue'
        universalStationsTitle.style.borderBottom = '1px black solid'
        universalStationsTitle.style.backgroundColor = 'lightgreen'
        for (let station of field.data) {
            const stationElement = document.createElement('div')
            stationElement.innerHTML = field.name.slice(2,3) + station.id
            stationElement.addEventListener('dblclick', function(){
                if (this.style.backgroundColor != 'red') {
                    this.style.backgroundColor = 'red'
                    const storageStations = JSON.parse(localStorage.getItem('storageStations') || "[]")
                    storageStations.push(this.innerHTML)
                    localStorage.setItem('storageStations', JSON.stringify(storageStations));
                } else {
                    if (station.type == 'Nike ARSAW') {
                        stationElement.style.backgroundColor = 'orange'
                        const storageStations = JSON.parse(localStorage.getItem('storageStations') || "[]")
                        const index = storageStations.indexOf(this.innerHTML)
                        const x = storageStations.splice(index, 1)
                        localStorage.setItem('storageStations', JSON.stringify(storageStations));
                    } else if (station.type == 'Nike Universal') {
                        stationElement.style.backgroundColor = 'lightblue'
                        const storageStations = JSON.parse(localStorage.getItem('storageStations') || "[]")
                        const index = storageStations.indexOf(this.innerHTML)
                        const x = storageStations.splice(index, 1)
                        localStorage.setItem('storageStations', JSON.stringify(storageStations));
                    } else if (station.type == 'Universal') {
                        stationElement.style.backgroundColor = 'lightgreen'
                        const storageStations = JSON.parse(localStorage.getItem('storageStations') || "[]")
                        const index = storageStations.indexOf(this.innerHTML)
                        const x = storageStations.splice(index, 1)
                        localStorage.setItem('storageStations', JSON.stringify(storageStations));
                    }
                }
            })
            if (station.type == 'Nike ARSAW') {
                arsawStations.appendChild(stationElement)
                stationElement.style.backgroundColor = 'orange'
                stationElement.style.borderBottom = '1px grey solid'

            } else if (station.type == 'Nike Universal') {
                nikeUniversalStations.appendChild(stationElement)
                stationElement.style.backgroundColor = 'lightblue'
                stationElement.style.borderBottom = '1px grey solid'
            } else if (station.type == 'Universal') {
                universalStations.appendChild(stationElement)
                stationElement.style.backgroundColor = 'lightgreen'
                stationElement.style.borderBottom = '1px grey solid'
            }

            if (localStorage.getItem('storageStations') != null) {
                const brokenStations = JSON.parse(localStorage.getItem('storageStations'))
                for (let brokenStation of brokenStations) {
                    if (stationElement.innerHTML == brokenStation) {
                        stationElement.style.backgroundColor = 'red'
                    }
            }
            }

        }

    }
    }
    catch(error)
    {
        loadingElement.innerHTML = 'Couldn\'t access the data.'
        console.log(error)
    }

}

//////dive deep page
function diveDeepPage() {
    flowControl.setAttribute('href', 'https://inbound-flow-control.amazon.com/powerup/MAN1/')
    emptyStations.setAttribute('href', 'https://inbound-flow-control.amazon.com/powerup/MAN1/emptystations')
    flowControl.style.color = 'black'
    emptyStations.style.color = 'black'
    diveDeep.style.color = 'rgb(255, 0, 0)'
    diveDeep.style.fontWeight = 'bold'

    const container = document.createElement('div')
    const inputContainer = document.createElement('form')
    const startDateLabel = document.createElement('label')
    startDateLabel.setAttribute('for', 'start-date')
    const startDateInput = document.createElement('input')
    startDateInput.setAttribute('type', 'datetime-local')
    startDateInput.setAttribute('id', 'start-date')
    startDateInput.setAttribute('name', 'start-date')
    const endDateLabel = document.createElement('label')
    endDateLabel.setAttribute('for', 'end-date')
    const endDateInput = document.createElement('input')
    endDateInput.setAttribute('type', 'datetime-local')
    endDateInput.setAttribute('id', 'end-date')
    endDateInput.setAttribute('name', 'end-date')
    const submit = document.createElement('input')
    submit.setAttribute('type', 'submit')

    loadingElement.remove()
    document.getElementsByTagName('body')[0].appendChild(container)
    container.appendChild(inputContainer)
    inputContainer.appendChild(startDateLabel)
    inputContainer.appendChild(startDateInput)
    startDateLabel.innerHTML = 'Start Date:'
    inputContainer.appendChild(endDateLabel)
    inputContainer.appendChild(endDateInput)
    endDateLabel.innerHTML = 'End Date:'
    inputContainer.appendChild(submit)

    container.style.backgroundColor = '#f5f5f5'
    container.style.maxWidth = '1000px'
    container.style.minWidth = '900px'
    container.style.margin = '15px auto 0 auto'
    inputContainer.style.width = '100%'
    inputContainer.style.display = 'flex'
    inputContainer.style.justifyContent = 'space-around'

    let timeCollection = []
    let tphCollection = []
    let etiRateCollection = []
    let tsiDecantRateCollection = []
    let tphPlannedCollection = []
    let etiPlannedRateCollection = []
    let tsiDecantPlannedRateCollection = []

    submit.addEventListener('click', async function(e) {
        e.preventDefault()
        timeCollection = []
        tphCollection = []
        etiRateCollection = []
        tsiDecantRateCollection = []
        tphPlannedCollection = []
        etiPlannedRateCollection = []
        tsiDecantPlannedRateCollection = []
        const startDateValue = new Date(document.getElementById('start-date').value)
        const endDateValue = new Date(document.getElementById('end-date').value)
        if ((endDateValue - startDateValue) <= 86400000 && (endDateValue - startDateValue) > 0) {
            const loadingAnimation = document.createElement('div')
            container.appendChild(loadingAnimation)
            loadingAnimation.innerHTML = 'Loading...'
            loadingAnimation.style.position = 'absolute'
            loadingAnimation.style.top = '45%'
            loadingAnimation.style.left = '42%'
            loadingAnimation.style.backgroundColor = 'white'
            loadingAnimation.style.fontSize = '1.5em'
            loadingAnimation.style.padding = '5px'
            loadingAnimation.style.border = '1px solid black'
            loadingAnimation.style.borderRadius = '15px'
            const searchLength = (endDateValue - startDateValue) / 1800000
            for (let i = 0; i < searchLength; i++) {
                loadingAnimation.innerHTML = 'Loading... ' + i + '/' + searchLength
                const startDate = new Date(startDateValue.getTime() + (i * 1800000))
                const endDate = new Date(startDateValue.getTime() + ((i + 1) * 1800000))
                const response = await pprHistoricalData(startDate, endDate)
                const PPRcontainer = document.createElement('html')
                PPRcontainer.innerHTML = response
                const tph = PPRcontainer.getElementsByClassName('actualProductivity')[67].innerText.trim()
                const etiRate = PPRcontainer.getElementsByClassName('actualProductivity')[21].innerText.trim()
                const tsiDecantRate = PPRcontainer.getElementsByClassName('actualProductivity')[16].innerText.trim()
                const tphPlanned = PPRcontainer.getElementsByClassName('planProductivity')[67].innerText.trim()
                const etiPlannedRate = PPRcontainer.getElementsByClassName('planProductivity')[21].innerText.trim()
                const tsiDecantPlannedRate = PPRcontainer.getElementsByClassName('planProductivity')[16].innerText.trim()
                const hours = endDate.getHours()
                let minutes = endDate.getMinutes()
                if (minutes == 0) {
                    minutes = '00'
                }
                const time = `${hours}:${minutes}`
                tphCollection.push(tph)
                timeCollection.push(time)
                etiRateCollection.push(etiRate)
                tsiDecantRateCollection.push(tsiDecantRate)
                tphPlannedCollection.push(tphPlanned)
                etiPlannedRateCollection.push(etiPlannedRate)
                tsiDecantPlannedRateCollection.push(tsiDecantPlannedRate)

            }
                document.getElementById('chart-container') ? document.getElementById('chart-container').remove() : 0
                loadingAnimation.remove()
                const chartContainer = document.createElement('canvas')
                chartContainer.setAttribute('id', 'chart-container')
                container.appendChild(chartContainer)
        } else {
            window.alert('Search limited to 24 hours window. Change selected days.')
        }


        const ratesChart = new Chart('chart-container', {
    type: 'line',
    data: {
        labels: timeCollection,
        datasets: [
            {
                label: 'TPH Actual',
                pointRadius: 4,
                pointBackgroundColor: "blue",
                data: tphCollection,
                borderColor: 'blue',
                borderWidth: 4
            },
            {
                label: 'ETI Actual',
                pointRadius: 4,
                pointBackgroundColor: "green",
                data: etiRateCollection,
                borderColor: 'green',
                borderWidth: 4
            },
            {
                label: 'TSI Decant Actual',
                pointRadius: 4,
                pointBackgroundColor: "orange",
                data: tsiDecantRateCollection,
                borderColor: 'orange',
                borderWidth: 4
            },
            {
                label: 'TPH Planned',
                pointRadius: 4,
                pointBackgroundColor: "#7393B3",
                data: tphPlannedCollection,
                borderColor: '#7393B3',
                borderWidth: 4
            },
            {
                label: 'ETI Planned',
                pointRadius: 4,
                pointBackgroundColor: "#8FBC8F",
                data: etiPlannedRateCollection,
                borderColor: '#8FBC8F',
                brderWidth: 4
            },
            {
                label: 'TSI Decant Planned',
                pointRadius: 4,
                pointBackgroundColor: "#F0E68C",
                data: tsiDecantPlannedRateCollection,
                borderColor: '#F0E68C',
                borderWidth: 4
            }
        ]
    },
    options: {
        plugins: {
            title: {display: true, text: 'Rates', position: 'top', font: {size: 25}}
        }
    }
});

    })

}

//style fullness table
function style(p2buffer, p2delta, p3buffer, p3delta, p4buffer, p4delta, totalBuffer, totalDelta, p2headcount, p3headcount, p4headcount, totalHeadcount, p2rate, p3rate, p4rate, totalRates) {

    let p2headcountColor = 120 - (Math.abs(Math.round(totalHeadcount / 3) - p2headcount) * 6)
    document.getElementById('p2headcount').style.backgroundColor = `hsl(${p2headcountColor}, 80%, 50%)`
    let p3headcountColor = 120 - (Math.abs(Math.round(totalHeadcount / 3) - p3headcount) * 6)
    document.getElementById('p3headcount').style.backgroundColor = `hsl(${p3headcountColor}, 80%, 50%)`
    let p4headcountColor = 120 - (Math.abs(Math.round(totalHeadcount / 3) - p4headcount) * 6)
    document.getElementById('p4headcount').style.backgroundColor = `hsl(${p4headcountColor}, 80%, 50%)`

    let p2rateColor = p2rate < 130 ? 0 : p2rate - 130
    document.getElementById('p2rates').style.backgroundColor = `hsl(${p2rateColor}, 80%, 50%)`
    let p3rateColor = p3rate < 130 ? 0 : p3rate - 130
    document.getElementById('p3rates').style.backgroundColor = `hsl(${p3rateColor}, 80%, 50%)`
    let p4rateColor = p4rate < 130 ? 0 : p4rate - 130
    document.getElementById('p4rates').style.backgroundColor = `hsl(${p4rateColor}, 80%, 50%)`

    let bufferColorP2 = Math.round(100 - Math.abs(p2delta * 100 / p2buffer)) > 0 ? Math.round(100 - Math.abs(p2delta * 100 / p2buffer)) : 0
    document.getElementById('p2buffer').style.backgroundColor = `hsl(${bufferColorP2}, 80%, 50%)`
    document.getElementById('p2delta').style.backgroundColor = `hsl(${bufferColorP2}, 80%, 50%)`
    let bufferColorP3 = Math.round(100 - Math.abs(p3delta * 100 / p3buffer)) > 0 ? Math.round(100 - Math.abs(p3delta * 100 / p3buffer)) : 0
    document.getElementById('p3buffer').style.backgroundColor = `hsl(${bufferColorP3}, 80%, 50%)`
    document.getElementById('p3delta').style.backgroundColor = `hsl(${bufferColorP3}, 80%, 50%)`
    let bufferColorP4 = Math.round(100 - Math.abs(p4delta * 100 / p4buffer)) > 0 ? Math.round(100 - Math.abs(p4delta * 100 / p4buffer)) : 0
    document.getElementById('p4buffer').style.backgroundColor = `hsl(${bufferColorP4}, 80%, 50%)`
    document.getElementById('p4delta').style.backgroundColor = `hsl(${bufferColorP4}, 80%, 50%)`
    let bufferColorTotal = Math.round(100 - Math.abs(totalDelta * 100 / totalBuffer)) > 0 ? Math.round(100 - Math.abs(totalDelta * 100 / totalBuffer)) : 0
    document.getElementById('totalbuffer').style.backgroundColor = `hsl(${bufferColorTotal}, 80%, 50%)`
    document.getElementById('totaldelta').style.backgroundColor = `hsl(${bufferColorTotal}, 80%, 50%)`

    const allFullnessElements = document.querySelectorAll('[id*="fullness"]')
    for (let element of allFullnessElements) {
        let x = element.innerHTML.substring(0, 2)
        x = Math.abs(x - 100) * 4
        if (x <= 100) {
            element.style.backgroundColor = `hsl(${x}, 80%, 50%)`
        } else if (x > 100) {
            element.style.backgroundColor = `hsl(0, 80%, 50%)`
        }

    }
}
