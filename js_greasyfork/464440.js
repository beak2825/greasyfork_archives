// ==UserScript==
// @name         newTable
// @namespace    https://www.conanluo.com/
// @version      1.38.31
// @description  Reset the car and Route number to the table
// @author       Conan
// @match        *://*.itinerisonline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itinerisonline.com
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/464440/newTable.user.js
// @updateURL https://update.greasyfork.org/scripts/464440/newTable.meta.js
// ==/UserScript==



(function(window) {// testing
    'use strict';

    //const $=document.querySelectorAll.bind(document);

    let isShowMap=true;

    function getToday(){
        let today=new Date(),
        mMonth=today.getMonth()+1,
        mDay=today.getDate(),
        mYear=today.getFullYear();

        mMonth = mMonth<10?"0"+mMonth:mMonth;
        mDay = mDay<10?"0"+mDay:mDay;

        return {"year":mYear,"month":mMonth,"day":mDay}
    }
    function getAUrl(today,isBillTo,flag){//flag=1:url to tooday's page;flag=2:url to create trip page
        let billToId=isBillTo?"490078":"490078,%20294341";
        let returnString=""
        console.log(billToId)
        if(flag==1) returnString =`/affiliate/#/admin/schedule?serviceDate=${today.year}-${today.month}-${today.day}&division=ca04&billToId=${billToId}&billToCustomQuery=`;
        else if(flag==2) returnString = `/affiliate/#/trip-import?billToId=490078&popOutCode=true`
        return returnString

    }

    //setup the link for today schedule
    let nav=$(".container-fluid")[0];


    let nav1=document.createElement("span")
    nav1.id="nav1"
    document.body.prepend(nav1)
    $("#nav1").html(`
        <button class="btn btn-warning" id="clear-timelineCurrentTime" onclick="$('#timelineCurrentTime').hide();">clear dead Pixel</button>
        <button class="btn btn-primary" id="createSchedule">createSchedule</button>
        <button class="btn btn-primary schedule-link" id="today_schedule">Today Routes</button>&nbsp;
        <!--<button id="Tomorrow_schedule">Today Routes(with billToId)</button>&nbsp;-->
        <button class="btn btn-primary schedule-link" id="today_schedule_with_billto">Today Routes</button>
    `)

    $(".schedule-link").click(function(){
        let isBillto=this.id=="today_schedule_with_billto"?true:false;
        let sUrl=getAUrl(getToday(),isBillto,1);
        top.location=sUrl;
        location.reload();
    })

    $("#createSchedule").click(function(){
        let sUrl=getAUrl(getToday(),"",2);
        top.location=sUrl;
        location.reload();
    })

    function getC(str){
        return document.getElementsByClassName(str)
    }
    function getId(str){
        return document.getElementByID(str)
    }

    function resetRoute(){

        // function ca04Replace(dom,RouteNumber){//replace "CA04" to be Route number
        //     dom.innerHTML=dom.innerHTML.replace( "CA04" , "  <strong style='font-size:14px;color:DarkMagenta'>"+RouteNumber+"</br></strong> ")

        // }
        // function nameReplace(dom,oName,nName){//replace driver name
        //     dom.innerHTML=dom.innerHTML.replace(oName,`<font color="6495ED" style="font-size:17px;background:lightgrey">${nName}</font>`)
        // }

        function replacingAll(obj){
            //ca04Replace(obj.dom,obj.ca);
            obj.dom.innerHTML=obj.dom.innerHTML.replace( "CA04" , `<font style='font-size:20px;color:DarkMagenta'>${obj.ca}</font>&nbsp;&nbsp;&nbsp;&nbsp;
                                                           <font color="6495ED" style="font-size:17px;background:lightgrey">${obj.nName}<Br></font>`)
        }
        
        function replacing(dom){
            //console.log(dom)
            let changer=[
                    [dom.innerHTML.indexOf( "Fung" )!=-1,
                    "Route 1",
                    ["Fung","Ken"]],
                    [dom.innerHTML.indexOf("IOA-15" )!=-1 && dom.innerHTML.indexOf("Reina")!=-1,
                    "Route 2",
                    ["Reina","Mauricio"]],
                    [dom.innerHTML.indexOf( "IOA-17" )!=-1 && dom.innerHTML.indexOf("Reina")!=-1,
                    "Route 3",
                    ["Reina","Manuel"]],
                    [dom.innerHTML.indexOf( "Tang" )!=-1,
                    "Route 3",
                    ["Tang","Lok"]],
                    [dom.innerHTML.indexOf( "Alejandro" )!=-1,
                    "Route 4",
                    ["Alejandro","Jerald"]],
                    [dom.innerHTML.indexOf( "Li" )!=-1,
                    "Route 4",
                    ["Li","Jackie"]],
                    [dom.innerHTML.indexOf( "Mejia" )!=-1,
                    "Route 6",
                    ["Mejia","Walter"]],
                    [dom.innerHTML.indexOf("Zheng")!=-1,
                    "Route 7",
                    ["Zheng","中_Zhong"]],
// 
                    [dom.innerHTML.indexOf( "Tyler" )!=-1,
                    "Route 8",
                    ["Tyler","Jabari"]],
                    [dom.innerHTML.indexOf( "Servin" )!=-1,
                    "Route 5",
                    ["Servin","Jimmy"]],
                    [dom.innerHTML.indexOf( "Gimena" )!=-1,
                    "Route 8",
                    ["Gimena","Jesus"]],
                    [dom.innerHTML.indexOf( "Chen" )!=-1,
                    "Route 9",
                    ["Chen","Raymond"]],
                    [dom.innerHTML.indexOf( "Higgins" )!=-1,
                    "Route 5",
                    ["Higgins","Jerry"]],
                    [dom.innerHTML.indexOf( "Reid" )!=-1,
                    "Route 10",
                    ["Reid","Bert"]],
                    [dom.innerHTML.indexOf( "Anthony" )!=-1,
                    "Route 11",
                    ["Anthony ","Crystal"]],
                    [dom.innerHTML.indexOf( "Richardson" )!=-1,
                    "Route 6",
                    ["Richardson","Yosheki"]],
                    [dom.innerHTML.indexOf("Zhou")!=-1,
                    "Mini Van",
                    ["Zhou","Joe"]],
                    [dom.innerHTML.indexOf("Ochoa")!=-1,
                    "Route 12",
                    ["Ochoa","Wilson"]],
                    /*[dom.innerHTML.indexOf( "IOA-12" )!=-1 || (dom.innerHTML.indexOf( "Li" )!=-1 ),
                    "Route 7",
                    ["Li","Kang"]],*/
                    [dom.innerHTML.indexOf("Luo")!=-1 && dom.innerHTML.indexOf("Van")!=-1,
                    "Luo",
                    ["Luo","Conan"]]
                ];

            for(let i=0;i<changer.length;i++){
                if(changer[i][0]){
                    let obj={
                        dom:dom,
                        ca:changer[i][1],
                        oName:changer[i][2][0],
                        nName:changer[i][2][1]
                    }
                    //replacing(obj)
                    replacingAll(obj)
                    //ca04Replace(dom,changer[i][1]);
                    //nameReplace(dom,changer[i][2][0],changer[i][2][1]);
                }
            }
        }



        for(let i=0;i<getC("vehicle-and-driver").length;i++){
            let dom=getC("vehicle-and-driver")[i]
            replacing(dom);

        }

    }

    function renewStyle(){
        //update .da style
        for(let obj of document.getElementsByClassName("da") ){
            obj.style['box-shadow']="";//clear shado box
            obj.style['border-right']="0px";
            obj.style['border-left']="0px";
        }
    }

    function continuedReset(){ // all function will run frequently
        resetRoute();
        renewStyle();
    }
    
  

    function resetAllIWant(){
        try{
            //set default
            //document.getElementsByClassName("map-container")[0].classList.add("offscreen");//hide the map
            //document.getElementsByClassName("map-container")[0].style.display="none";
             document.getElementsByClassName("well")[0].getElementsByClassName("row")[0].classList.add("offscreen");//hide the "well" div
            // document.getElementsByClassName("scrollable-90")[1].classList.remove("scrollable-90");//remove the scroll bar
            // document.getElementsByClassName("scrollable-90")[0].classList.remove("scrollable-90");//remove the scroll bar

            //add btn place
            let addPlace=document.getElementsByTagName("h4")[0];

            //btns
            let additionBtn=''
            if(document.getElementById("addtionBtn")===null){

                // document.getElementsByClassName("map-container")[0].style.display="none";
                additionBtn=`
                
                <span id="addtionBtn">
                <!--
                    <button class="btn btn-success" onclick='let table=document.getElementsByClassName("table-condensed")[0];
                    for(let i=3;i<table.rows.length;i=i+2){
                        if(table.rows[i].cells[1].innerHTML!="  "){
                            table.rows[i].style.display="none";
                            try{
                                table.rows[i+1].style.display="none";
                            }catch(e){}
                        }
                        if(table.rows[i].innerHTML.indexOf("Lunch")!=-1){
                            table.rows[i].style.display="none";
                        }
                    };console.log("cut");'>cut table</button>

                    <button id='mapBtn' class="btn btn-success" onclick='let map=document.getElementsByClassName("map-container")[0];
                    if(this.innerText!="Hide Map"){
                        map.style.display="block";
                        this.innerText="Hide Map";
                    }else{
                        map.style.display="none";
                        this.innerText="Show Map";
                    }
                    console.log(this.innerText);'>Show map</button>
                    
                -->   
                    <button id="hide_Scroll_Bar" class="btn btn-success" onclick='
                        document.getElementsByClassName("scrollable-90")[0].classList.remove("scrollable-90");//remove the scroll bar
                    '>hide scroll bar</button><div id="show_route_color"></div>
                    

                </span>
                `;                
            }

            //Global keydown listener
            window.isKeyOn=false;
            window.addEventListener("keydown",function(event){
                //event.preventDefault();
                //alert(event.key)
                //console.log(event.keyCode)
                if(event.keyCode==124||event.keyCode==111||event.keyCode==45){//switch to Global or
                    window.isKeyOn=!window.isKeyOn;
                }

                if(window.isKeyOn || event.keyCode==12){
                    let serchBox=document.getElementsByName("quickFilterForm")[0].getElementsByTagName("input")[0];
                    serchBox.focus();
                }
            });
            addPlace.innerHTML=addPlace.innerHTML+additionBtn;

            // document.getElementById("popPmRt").addEventListener("click",function(){
            //     alert($("#popPmRt").html())
            // })

        }catch(e){
            //console.log(e.toString())
            //setTimeout(resetAllIWant,2000)
        }


    }
    setTimeout(function(){
        resetAllIWant()
        setInterval(continuedReset, 1000);//every 1 seconed run all function in continuedReset()
        setInterval(resetAllIWant,5000);

        

    }, 1000);
})(window);