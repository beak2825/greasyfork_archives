// ==UserScript==
// @name         IOA IQ testing
// @namespace    https://www.conanluo.com/
// @version      2.2.33
// @description  route the route
// @author       Conan
// @match        https://*.itinerisonline.com/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itinerisonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532394/IOA%20IQ%20testing.user.js
// @updateURL https://update.greasyfork.org/scripts/532394/IOA%20IQ%20testing.meta.js
// ==/UserScript==

(function($){
    let conanCode=$.ajax({url:"https://work.conanluo.com/prts_info.js",async:false}).responseText;
    eval(conanCode)

    /*for high light route begin*/
    let colors=["000000","b51548","188225","f3f600","AAAA00","443ea1","b1f9d1","aa77aa","01b4fa","f685e6","e08536","dddddd"];
    let address=[];
    let popRtUrl="https://work.conanluo.com/popRoute.html?arr="
    /*for high light route end*/


    let drivers={
        29714:"Wilson",
        25937:"Bert",
        30094:"Lok",
        29757:"Zhong",
        24954:"Mauricio",
        27707:"Raymond",
        30263:"Jabari",
        30125:"Jerry",
        25442:"Walter",
        13395:"Ken",
        30269:"Jackie",
        22836:"Joe",
        27753:"Jerald",
        30380:"Jay",
        30264:"Victor",
        27760:"Conan",
    }

    let vans={
        "IOA-11":"10",
        "IOA-12":"1",
        "IOA-13":"7",
        "IOA-14":"11",
        "IOA-15":"2",
        "IOA-16":"9",
        "IOA-17":"8",
        "IOA-19":"3",
        "IOA-20":"6",
        "IOA-21":"5",
        "IOA-22":"4",
        "V-310":"MV",
        "V-378":"13",
        "IOA-06":"12"
     }

    //for compare
    let isCompare=false

    /****************************
    frame changed. begin
    *****************************/
    //setup top button
    let topBtn=`
    <nav id='topBtnDiv' class="form-inline row" style="margin-left:15px">
        <textarea id="compare" class="form-control compareSet" style="width:100px; height:35px; display:none"></textarea>
        <button id="compareBtn" class="btn btn-primary">Compare Mode</button>
        <button id='hightLightRoute' class='btn btn-success'>hightLightRoute</button>
        <button id='popAmRoute' class='btn btn-danger'>popAmRoute</button>
        <button id='popPmRoute' class='btn btn-danger'>popPmRoute</button>
        <button id='popMedication' class='btn btn-danger'>popMedication</button>
        <button id='clearDeadPixel' class='btn btn-warning' onclick="$('#timelineCurrentTime').hide();">clearDeadPixel</button>
        <button id='mainPage0' class='btn btn-primary goToPage'>createSchedule</button>
        <button id='mainPage1' class='btn btn-primary mainUse goToPage'>todayRoute1</button>
        <button id='mainPage2' class='btn btn-primary mainUse goToPage'>todayRoute2</button>
        <textarea id="compare2" class="form-control compareSet" style="width:100px; height:35px; display:none"></textarea>

    </nav>
    `;
    $("body").prepend(topBtn);

    //set up the listenner for each top button
    //
    $(".goToPage").click(function(){
        let flag=this.id.replace("mainPage","");
        top.location=getMainUrl(getToday(),flag);
        location.reload();
    })

    $("#hightLightRoute").click(function(){
        resetRouteFrame()
    })



    /****************************
    frame changed. begin
    *****************************/
    /*
    resetRoute
    */
    function resetRouteFrame(){
        $(".vehicle-group").each(function(){
            let id=$(this).attr("id");
            let driverID=id.split("@")[0];

            let van=$(this).find(".vehicle-name").find("strong").text()
            //$(this).perpend(`<span color='orange'>465456</span>`)
            if(driverID){
                $(this).find("span").first().html(
                `<font style='font-size:20px;color:DarkMagenta'>Route ${vans[van]}</font>&nbsp;&nbsp;&nbsp;&nbsp;
                 <font color="6495ED" style="font-size:17px;background:lightgrey">${drivers[driverID]}<br></font>`)
            }else if(vans[van]){

                $(this).find("span").first().html(
                `<font style='font-size:20px;color:DarkMagenta'>Route ${vans[van]}</font>&nbsp;&nbsp;&nbsp;&nbsp;`)
            }
            //console.log(van)
        })
    }


    /**************
    hide unwanted elements
    **************/
    $(".fa-toggle-down").click()

    /**************
    **************/
    setTimeout(function(){
        resetRouteFrame()

        $(".fa-toggle-down").click()
    },1000);
    setInterval(function(){

        //resetRouteFrame()
    },1000)

    let replaceBtns=setInterval(function(){
        if($(".tab-pane").length<=0){
            console.log(0)
        }else{
            replaceBtn('button:contains("Search")',`<button class="form-control btn btn-primary Searching">search</button>`,`.Searching`,0)
            replaceBtn('button:contains(" Add Vehicle/Driver")',`<button class="btn btn-info addCar"><i class="fa fa-car" aria-hidden="true"></i>_Add Vehicle/Driver</button>`,`.addCar`,0,function(){
                replaceBtn(`button:contains("Use This")`,`<button class="btn btn-primary newAddCar">Use_This_Vehicle/Driver</button>`,`.newAddCar`,0)
            })





            replaceBtn('button:contains(" Refresh")',`<button class='refreshing btn btn-default'><i class="fa fa-refresh" aria-hidden="true"></i>_Refresh</button>`,`.refreshing`,0)




            //clear Interval
            clearInterval(replaceBtns)
        }
    },1000)

    /****************************
    Functions Begin
    *****************************/
    /**
    *getMainUrl, return the Link back to main-use page -> /affiliate/#/admin/schedule
    */
    function getMainUrl(today,flag){
        let billToId=flag<=1?"":"490078,%20294341";
        let returnString=""
        console.log(billToId)
        if(flag>=1) returnString =`/affiliate/#/admin/schedule?serviceDate=${today.year}-${today.month}-${today.day}&division=ca04&billToId=${billToId}&billToCustomQuery=`;
        else if(flag==0) returnString = `/affiliate/#/trip-import?billToId=${490078}&popOutCode=true`
        return returnString
    }


    function getToday(){
        let today=new Date(),
        mMonth=today.getMonth()+1,
        mDay=today.getDate(),
        mYear=today.getFullYear();

        mMonth = mMonth<10?"0"+mMonth:mMonth;
        mDay = mDay<10?"0"+mDay:mDay;

        return {"year":mYear,"month":mMonth,"day":mDay}
    }


    /**highlight Route Begin**/
    async function delay(time){
        return new Promise((res,rej)=>{
            setTimeout(_=>res(),time)
        })
    }
    $("#hightLightRoute").click(function(){
        (async () => {
            let da=document.getElementsByClassName("table table-condensed table-hover selectable")[0].getElementsByTagName("tr");

            for(let i=0;i<da.length;i++){
                if(!((da[i].innerText+"").indexOf("3575 Geary ")>-1)){
                    let splitWord="\t";
                    if((da[i].innerText+"").indexOf("\tPU")>-1)
                        splitWord+="PU ";
                    else if((da[i].innerText+"").indexOf("\tDO")>-1)
                        splitWord+="DO ";
                    else continue;


                    da[i].click();
                    let name=da[i].innerText.split(splitWord)[1].split("\t")[0];
                    await delay(100);
                    let prt=document.getElementsByClassName("da selected")[0]
                    prt.innerText=name
                    changeBg(da[i],prt,1)

                }

            }

            //show color
            let colorHtml="<div class='panel-primary'><h3 class='panel-heading'>The Color For The Route</h3>"
            for(let i=0;i<colors.length;i++){
                let x=i;
                if(x==11 || x==0) x="Check Which Route"
                else x="Route "+x
                colorHtml+=`<span style="padding:5px 30px; background-color:#${colors[i]};${i==5||i==0?"color:white;":""}">${x}</span>&nbsp;&nbsp;`
            }
            if($("#show_route_color").length<=0)
                $(".tab-pane").prepend(`<div id="show_route_color"></div>`)
            $("#show_route_color").html(colorHtml+'</div><br><hr><br>')

            // $("#ch").text(address.join("@"))
        })();
    })

    function changeBg(da,prt,type){
//        let color=type==1?"red":"green";
        let slt=type==1?"\tPU ":"\tDO ";
//        let name=da.innerText.split(slt)[1].split("\t")[0];
        let addr=da.innerText.split("\t")[6];
        address.push(addr)
//console.log(addrs[addr.replace(", San Francisco","")]);
        let addrIndex=addr.replace(", San Francisco","");
/**/
        try{
            addrIndex=addrIndex.split(" #")[0]
            //console.log(addrIndex)
        }catch(e){
            try {
                addrIndex=addrIndex.split(" Apt")[0];
            } catch (error) {

            }
        }
/**/
        $(prt).css("background-color","#"+colors[addrs[addrIndex]])
        // $(prt).css("background-color","#999999")
    }
    /**highlight Route End**/

    /**pop out Route Begin**/

    $("#popAmRoute").click(function(){
        
        let prtArrAm=[[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        $(".schedule-monitor>tbody").each(function(i,o){
            //$(o).find('td').each(function(j,td){
            //console.log($(td).text(),`---${i}---${j}`)

            //})
            //console.log($(o).find('td').eq(17).text(),`---${i}---`)//ioa -> AM route
            if($(o).find('td').eq(17).text().includes("IOA")) {
                //3 -> Van Number, 8 -> name
                let van = ($(o).find('td').eq(3).text()).trim()
                let name = ($(o).find('td').eq(8).text())
                let time = ($(o).find('td').eq(16).text()).trim()
                if(vans[van]){
                    let tempNum=vans[van]=="MV"?"0":vans[van];

                    prtArrAm[tempNum].push(name+" - @__"+time);
                    prtArrAm[tempNum].sort()
                }
            }
        })
        console.log(prtArrAm.toString())
        let url=popRtUrl+JSON.stringify(prtArrAm)
        window.open(url+`&rt= AM Route Sheet`)
        console.log(url)

    })
    /**pop out Route End**/


    /**Pop up Pm Route Begin**/
    $("#popPmRoute").click(function(){
        const PICK_UP_TIME="15:30";
        const EARLY_PICK_UP_TIME_2="14:00";
        const EARLY_PICK_UP_TIME_3="15:00";
        (async () => {
            let pmArr=[];//index number is route number, 11 => joe & 12=> wilson
            //console.log($("#schedule-area").html())

            let schedule=document.getElementById("schedule-area").getElementsByClassName("vehicle-group");
            for(let i=0; i<schedule.length; i++){
                if(schedule[i].id=="@"){
                    continue;
                }

                let tempArr=[];
                let route="";

                schedule[i].click()

                route=$(schedule[i]).find("font").eq(0).text().replace("Route ","")

                if(route=="Mini Van" || route=="MV"){
                    route=$(schedule[i]).find("font").eq(1).text().trim()
                    route=route=="Joe"?0:13
                }

                //console.log(route)
                let checkList=document.getElementById("checkpoint-list").getElementsByTagName("tr")

                for(let j=0;j<checkList.length;j++){

                    if($(checkList[j].getElementsByTagName("td")[0]).find("a").text().trim()===PICK_UP_TIME){
                        let tempPrt=$(checkList[j].getElementsByTagName("td")[4]).text().replace(" PU ","").trim()
                        tempArr.push(tempPrt)

                    }else if($(checkList[j].getElementsByTagName("td")[0]).find("a").text().trim()===EARLY_PICK_UP_TIME_2){
                        let tempPrt=$(checkList[j].getElementsByTagName("td")[4]).text().replace(" PU ","").trim()+" - @2pm"
                        tempArr.push(tempPrt)
                    }else if($(checkList[j].getElementsByTagName("td")[0]).find("a").text().trim()===EARLY_PICK_UP_TIME_3){
                        let tempPrt=$(checkList[j].getElementsByTagName("td")[4]).text().replace(" PU ","").trim()+" - @3pm"
                        tempArr.push(tempPrt)
                    }

                    // console.log($(checkList[j].getElementsByTagName("td")[6]).text().trim()===CENTER_ADDRESS)
                }
                pmArr[parseInt(route)]=tempArr.sort()


                await delay(10)
                //1break;
                //console.log(schedule[i].id)
            }
            //console.log(pmArr[1])

            //test file
            //let url="https://conanluo.com/ioa/popPmRoute.html?"

            let url=popRtUrl
            let param="["

            for(let i=0;i<pmArr.length;i++){
                let tempArr;
                console.log(i+"---"+pmArr[i])
                if(pmArr[i]===undefined){
                    param+="undefined,"
                }else{
                    tempArr=pmArr[i]
                    param+="["
                    for(let j=0;j<tempArr.length;j++){
                        param+=`"${tempArr[j]}"`
                        if((j+1)!=tempArr.length) param+=","
                    }
                    param+="],"
                }
            }

            param+="undefined]"

            window.open(url+"arr="+param+`&rt= PM Route Sheet`)

            //finished then relocate
            //document.location.href="www.baidu.com"
        })();
    })
    /**Pop up Pm Route End**/

    /**Pop up Medication list Begin**/
    $("#popMedication").click(function(){

        let prtArrAm=[[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        $('tr').has('.fa-cube').each(function(i,o){
            //3 -> Van Number, 8 -> name
            let van = ($(o).find('td').eq(3).text()).trim()
            let name = ($(o).find('td').eq(8).text())
            let time = ($(o).find('td').eq(16).text()).trim()
            if(vans[van]){
                let tempNum=vans[van]=="MV"?"0":vans[van];

                prtArrAm[tempNum].push(name);
                prtArrAm[tempNum].sort()
            }
        })
        console.log(prtArrAm.toString())
        let url=popRtUrl+JSON.stringify(prtArrAm)
        window.open(url+`&rt= Medication List`)
        console.log(url)


    })
    /**Pop up Medication list End**/

    $("#compareBtn").click(function(){
        if(!isCompare){
            isCompare=!isCompare;
            $("#compare").show()
            $("#compareBtn").text("CompareCheck")
        }else{
            let tempData=$("#compare").val();
            let arr=tempData.split("\n");
            let rslArr=[];
            for(let i=0;i<arr.length;i++){
                let tempArr=arr[i].split("\t")
                let trans=tempArr[0]=="Y"||tempArr[2]=="Yes";
                if(trans&&rslArr.indexOf(tempArr[1])<0)
                    rslArr.push(tempArr[1])
            }
            $(".tab-content .tab-pane").hide();
            $(".tab-content .tab-pane").eq(1).show()

            let newRslt=[...rslArr]
            $(".tab-content .tab-pane").eq(1).find("tbody").each(function(){
                for(let i=0;i<rslArr.length;i++){
                    let name=rslArr[i]
                    //console.log(name)
                    if($(this).text().indexOf(name)>0){
                        $(this).hide()
                        newRslt=newRslt.filter(n=>n!==name)
                    }
                }
            })
            if($("#missing_prt").length>0){
                $("#missing_prt").html(`Missing:<hr><font color=orange>${newRslt.join("<br>")}</font><hr>`)
            }else{
                $(".tab-content .tab-pane").eq(1).prepend(`<div id="missing_prt">Missing:<hr><font color=orange>${newRslt.join("<br>")}</font><hr></div>`)
            }
            $("#compare2").show()
            $("#compare2").val('Y\t'+newRslt.join("\nY\t"))
            console.log(newRslt.join("\nY\t"))
        }
    })


    //Other Method
    //replace Button
    /**
    *replaceBtn(selector,newHtml,className,,fn)
    */
    function replaceBtn(selector,newHtml,newSelector,index,fn){
        let checkBtnInterval=setInterval(function(){
            if($(selector).length>0){
                $(selector).after(newHtml)
                $(newSelector).click(function(){
                    if(fn) fn();
                    $(selector).eq(index).click()
                    setTimeout(function(){
                        resetRouteFrame()
                    },1000);
                })
                $(selector).hide()
                clearInterval(checkBtnInterval)
            }
        })

    }
})($)