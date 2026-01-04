// ==UserScript==
// @name         IOA IQ
// @namespace    https://www.conanluo.com/
// @version      1.3.31
// @description  route the route
// @author       Conan
// @match        https://*.itinerisonline.com/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itinerisonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523062/IOA%20IQ.user.js
// @updateURL https://update.greasyfork.org/scripts/523062/IOA%20IQ.meta.js
// ==/UserScript==

(function($){

    let addrs,prtObjInfo

    /*for high light route begin*/
    let colors=["000000","b51548","188225","f3f600","AAAA00","443ea1","b1f9d1","aa77aa","01b4fa","f685e6","e08536","dddddd"];
    let address=[];
    let popRtUrl="https://work.conanluo.com/popRoute.html?arr="
    /*for high light route end*/


    let wanderPrt=[
        "Auyeung, Shum K",
        "Chan, Suk Ching",
        "Chen, Buoy Lan",
        "Chiang, Kuo Hsiun",
        "Chin, Ang Lin",
        "Chu, Pak",
        "Chung, Isaac I",
        "Hui, Wai Chun Ngai",
        "Hwang, Soon",
        "Chow, James",
        "Lee, Lap Chow",
        "Lee, Ngan Chu",
        "Lee, Sooja",
        "Mosier, Jessica",
        "Penry, Paul E",
        "Wong, Gam Fee",
        "Yuan, Fu Mei"
    ]

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
        "IOA-14":"8",
        "IOA-15":"2",
        "IOA-16":"9",
        "IOA-17":"11",
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
    <nav id='topBtnDiv' class="form-inline row" style="margin-left:15px;">
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
        <button id='CancellationReport' class='btn btn-primary CancellationReport'>CancellationReport</button>
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
        let conanCode=$.ajax({"url":"https://work.conanluo.com/prts_info3.js","async":false}).responseText;
        console.log(conanCode)
        eval(conanCode)
        resetRouteFrame()
    })

    /****************************
    //search add toggle() listener start
    *****************************/
    function setNav(){
        if($("#showNavBtn").length<=0){
            $(".navbar-header").prepend(`<button id='showNavBtn' class='btn btn-success' style='padding:1px;margin-top:9px;height:30px'>show/hide Nav</button>`)
            $("#showNavBtn").click(function(){
                $("#topBtnDiv").toggle()
            })

        }
    }
    /****************************
    //search add toggle() listener End
    *****************************/



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

        resetRouteFrame();
        setNav()
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

    function changeBg(da,prt,type){//Boulevard, Avenue, Street
//        let color=type==1?"red":"green";
        let slt=type==1?"\tPU ":"\tDO ";
//        let name=da.innerText.split(slt)[1].split("\t")[0];
        let addr=da.innerText.split("\t")[6];
        address.push(addr)
//console.log(addrs[addr.replace(", San Francisco","")]);
        let addrIndex=addr.replace(", San Francisco","").replaceAll("Street","St").replaceAll("Avenue","Ave").replaceAll("Boulevard","Blvd");
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
                    let wanderSign=wanderPrt.indexOf(name)==-1?"":"__<b>Warning</b>"
                    let tempNum=vans[van]=="MV"?"0":vans[van];

                    prtArrAm[tempNum].push(name+" - @__"+time+wanderSign);
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

        let prtArrPm=[[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        $(".schedule-monitor>tbody").each(function(i,o){
            //$(o).find('td').each(function(j,td){
            //console.log($(td).text(),`---${i}---${j}`)

            //})
            //console.log($(o).find('td').eq(17).text(),`---${i}---`)//ioa -> AM route
            //console.log(time)
            if($(o).find('td').eq(14).text().includes("15:30") ||
               $(o).find('td').eq(14).text().includes("15:00") ||
               $(o).find('td').eq(14).text().includes("14:00") ||
               $(o).find('td').eq(14).text().includes("14:30") ||
               $(o).find('td').eq(14).text().includes("12:30")
              ) {
                //3 -> Van Number, 8 -> name
                let van = ($(o).find('td').eq(3).text()).trim()
                let name = ($(o).find('td').eq(8).text())
                let time = " - @"+($(o).find('td').eq(14).text()).trim()
                //console.log(time)
                if(vans[van]){
                    let tempNum=vans[van]=="MV"?"0":vans[van];
                    let wanderSign=wanderPrt.indexOf(name)==-1?"":"__<b>Warning</b>"

                    if(time===" - @15:30") time="";
                    prtArrPm[tempNum].push(name+time+wanderSign);
                    prtArrPm[tempNum].sort()
                }
            }
        })
        console.log(prtArrPm.toString())
        let url=popRtUrl+JSON.stringify(prtArrPm)
        window.open(url+`&rt= PM Route Sheet`)
        console.log(url)

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

    /**Compare the new DAR and old schedule Start**/
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
                        break;
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
    /**Compare the new DAR and old schedule End**/


    /**download cancellation report start**/
    $(".CancellationReport").click(async function(){

        let $table=$('table:has(span:contains("Ref"))')

        let cAArr=new Set([]);
        let cDArr=new Set([]);
        let nSArr=new Set([]);
        let _2ndRound=new Set([]);

        if($('label:contains("Canceled No Charge")').attr("class").indexOf("active")==-1){
            $('label:contains("Canceled No Charge")').click()
            await delay(1000)
        }
        //alert($table.find("tr").eq(1).find("td").eq(18).find("div").attr("title"))

        let size=$table.find("tr").length

        for(let i=1;i<size;i++){

            if($table.find("tr").eq(i).find("td").eq(8).text().includes("45 Day")) continue;
            if(""===$table.find("tr").eq(i).find("td").eq(3).text()) continue;
            if("DME & Rx (80)"===$table.find("tr").eq(i).find("td").eq(5).find("span span").attr("title")) continue;
            let status=$table.find("tr").eq(i).find("td").eq(13).text().trim()

            let name=$table.find("tr").eq(i).find("td").eq(8).text().trim()
            let pickUpTime=parseInt($table.find("tr").eq(i).find("td").eq(14).text().replace(":",""))
            let isFromHome=$table.find("tr").eq(i).find("td").eq(15).find("i.fa-home").length>0?true:false;
            let detLocation=$table.find("tr").eq(i).find("td").eq(17).text().trim()

            if(!(isFromHome&&detLocation==="IOA")) continue; //only get from Home

            //get 2nd pickup first
            if(pickUpTime>=1000&&pickUpTime<1200){
                _2ndRound.add(`"${name}"`)
            }

            if(status.indexOf("Canceled")==-1) continue;


            let note=$table.find("tr").eq(i).find("td").eq(18).find("div").attr("title").replace("Cancel Notes: ","").trim().replace(name,"").replaceAll("\n",";")

            if($table.find("tr").eq(i).find("td").eq(18).text().indexOf("no show")!==-1){
                if(status.split("\n")[1]!="")
                    nSArr.add(`"${name}" - "${note}"`)
            }else if(status=="CanceledNoCharge"){
                //if(note.split("\n")[1]!=""){

                cAArr.add(`"${name}" - "${note}"`)
                //}

            }else if(status=="Canceled"){
                if(status.split("\n")[1]!="")
                    cDArr.add(`"${name}" - "${note}"`)

            }
            //console.log(name,note)
            //console.log($table.find("tr").eq(i).text())
        }
        //console.log(Array.from(cAArr).join("\n"))
        //console.log(Array.from(cDArr).join("\n"))
        //console.log(Array.from(nSArr).join("\n"))

        let txt=[
            "Cancellation in advance","-------------------",...(Array.from(cAArr).sort().length>0?Array.from(cAArr).sort():["None at this time"]),
            "","Cancellation at door","-------------------",...(Array.from(cDArr).sort().length>0?Array.from(cDArr).sort():["None at this time"]),
            "","No Show","-------------------",...(Array.from(nSArr).sort().length>0?Array.from(nSArr).sort():["None at this time"]),
            "","2nd Pick Up","-------------------",...(Array.from(_2ndRound).sort().length>0?Array.from(_2ndRound).sort():["None at this time"])
        ].join("\n")
        console.log(txt)
        downloadTextFile(txt,"Cancellation Report_"+((new Date().getMonth("MM"))+1)+(new Date().getDate())+(new Date().getFullYear())+".txt")

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function downloadTextFile(textContent, filename) {
        // 1. & 2. 创建包含文本内容的 Blob 对象，指定 MIME 类型和字符集
            const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });

            // 4. 创建一个 <a> 元素
            const link = document.createElement('a');

            // 检查浏览器是否支持 download 属性 (现代浏览器都支持)
            if (link.download !== undefined) {
                // 3. 为 Blob 创建一个对象 URL
                const url = URL.createObjectURL(blob);

                // 5. 设置链接的 href 为对象 URL，设置 download 属性为期望的文件名
                link.setAttribute('href', url);
                link.setAttribute('download', filename);

                // 让链接在页面上不可见
                link.style.visibility = 'hidden';

                // 必须将链接添加到 DOM 中才能触发点击 (尤其在 Firefox 中)
                document.body.appendChild(link);

                // 6. 用代码模拟点击链接
                link.click();

                // 7. 清理：从 DOM 中移除链接，并释放对象 URL
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

            } else {
                // 为不支持 download 属性的旧浏览器提供后备方案
                //console.error("当前浏览器不支持自动下载功能。");
                alert("Your Browser does not allow you to do that. \nFaild to download. \nType 'F12' to get the report");
                // 也可以尝试在新窗口中打开文本内容，但这通常不是用户期望的下载行为
                // const newWindow = window.open();
                // newWindow.document.write('<pre>' + textContent + '</pre>');
            }
        }
    })
    /**download cancellation report end**/
})($)