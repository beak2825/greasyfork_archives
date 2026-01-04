// ==UserScript==
// @name         NewDAR
// @namespace    http://tampermonkey.net/
// @version      1.5.23
// @description  update DAR faster
// @author       Conan
// @match        https://*.itinerisonline.com/affiliate/
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itinerisonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471860/NewDAR.user.js
// @updateURL https://update.greasyfork.org/scripts/471860/NewDAR.meta.js
// ==/UserScript==



$(document).ready(function() {
    'use strict';
    let isExternal=false;
    let noteType=0; // noteType: 0:Attx 1:External,  2:Medication
    let prts=getPrtsArr();
    let attx=[];

    let attxCode=""
//console.log("11111---------",JSON.stringify(prts[1].noAM?false:true))

    //jquery extend
    $.getUrlParam=function(name){

        let reStr="",hrefStr=window.location.href;

        if(hrefStr.indexOf(name)>=0){
            reStr=hrefStr.split("?")[1].split(name+"=")[1].split("&")[0]
        }


        return reStr
    }

    //add the attendance days button function
    $(".footer:first").html($(".footer:first").html()+`<button id='day1' class='attxDay btn btn-primary'>Monday</button>
<button id='day2' class='attxDay btn btn-primary'>Tuesday</button>
<button id='day3' class='attxDay btn btn-primary'>Wednesday</button>
<button id='day4' class='attxDay btn btn-primary'>Thursday</button>
<button id='day5' class='attxDay btn btn-primary'>Friday</button>
<!--<button id="dar" class="hideTable btn btn-primary">switch</button>-->
<button id="External" class="btn btn-success">External</button>
<button id="Medication" class="btn btn-success">Medication</button>
<button id="Acupuncture" class="btn btn-success">Acupuncture</button>
<button id="popOutCode" class="popOutCode btn btn-danger">popOutCode</button>
`)

    $(".footer:first").html($(".footer:first").html()+`
    <div id='hightLightPrt'>
        <button id="rt1" class="selectedRoute">1</button>
        <button id="rt2" class="selectedRoute">2</button>
        <button id="rt3" class="selectedRoute">3</button>
        <button id="rt4" class="selectedRoute">4</button>
        <button id="rt5" class="selectedRoute">5</button>
        <button id="rt6" class="selectedRoute">6</button>
        <button id="rt7" class="selectedRoute">7</button>
        <button id="rt8" class="selectedRoute">8</button>
        <button id="rt9" class="selectedRoute">9</button>
        <button id="rt10" class="selectedRoute">10</button>
        <button id="rtjow" class="selectedRoute">joe</button>
        <button id="rtwilson" class="selectedRoute">wilson</button>
    </div>
    <div id='mainTable'>
    <form><table style="width:100%;font-size:20px;background:#4E2236;color:#4E2236" id="dar_table"></table></form>
    </div>`);
    $('#hightLightPrt').hide();
    let tableInner=`
    <tr style="color:#F26363">
    <th style="width:3%"><input type="reset" name="prts" id="check_all" value="reset"></th>
    <th style="width:7%">Prt ID</th>
    <th style="width:15%">Prt Name</th>
	<th style="width:10%">A Leg location</th>
    <th style="width:10%">B leg Location</th>
    <th style="width:10%">Begin Time</th>
    <th style="width:10%">End Time</th>
    <th style="width:12%">Appt Type</th>
    <th style="width:15%">Notes</th>
    <th style="width:8%">AM/PM</th>
  </tr>`;

//fill the prt to the table
    console.log(JSON.stringify(prts))
    for(let prt of prts){
        let temp="<tr class='each_prt' style='background:#E997A7;border-bottom:1px solid #000000'>";
        temp+=`<td><input type="checkbox" class="prtBox" name="prts" id="${prt.id}" style="zoom:200%"></td>`;
        temp+=`<td class="prt_id_">${prt.id}</td>`;
        temp+=`<td>${prt.name}</td>`;
        temp+=`<td><input style='background-color:transparent' size='10' type="text" class="A_leg" id="${prt.id}_A_leg_id" value="${prt.address?prt.address:prt.id}"><input type="hidden" class="org_A_lag" value="${prt.address?prt.address:prt.id}"</td>`;
        temp+=`<td><input style='background-color:transparent' size='10' type="text" class="B_leg" id="${prt.id}_B_leg_id" value="490078"><br></td>`;
        temp+=`<td><input style='background-color:transparent' size='10' class="beginTime" type="text" id="${prt.id}_Begin_Time" value="${prt.amTime?prt.amTime:'10:00'}"></td>`;
        temp+=`<td><input style='background-color:transparent' size='10' class="endTime" type="text" id="${prt.id}_End_Time" value="15:30"></td>`;
        temp+=`<td><input style='background-color:transparent' class="AppType" type="text" id="${prt.id}_appt_type" value="Center Attendance"></td>`;
        temp+=`<td><input style='background-color:transparent' class="prtNote" type="text" id="${prt.id}_note" value="${prt.note?prt.note:''}"></td>`;
        temp+=`<td>am:<input style='background-color:transparent;zoom:180%' class="am" type="checkBox" id="${prt.id}_am" ${!prt.noAm?"checked":""}>
                   pm:<input style='background-color:transparent;zoom:180%' class="pm" type="Checkbox" id="${prt.id}_pm" ${!prt.noPm?"checked":""}></td>`;


        temp+="</tr>";
        tableInner+=temp;
    }
    tableInner+=`<tr><td colspan="8"><button id="submit">submit</button></td></tr>`;


    $("#dar_table").html(tableInner);


    $(".prtBox").click(function(e){

        let temp = buildPrtList(this.id)

        if($(this).is(":checked")){
            //temp+=(prt.id+'\n')
            attx.push(temp);
        }else{
            attx=attx.filter(p=>p!=temp)
        }
        //alert(attxList)
        $("#pasteArea").val(attx.join("\n"));
        attxCode=attx.join("\n");

    })

    //add the listener to the button
    $(".attxDay").click(function(e){
        attxCode=""
        let day=this.id.replace("day","")
        attx=[];
        for(let prt of prts){
            let temp = buildPrtList(prt.id)
            if(prt.comeDay.indexOf(day)>=0 && !$("#"+prt.id).is(":checked")){
                $("#"+prt.id).prop("checked",true)
                attx.push(temp);

            }else{
                $("#"+prt.id).prop("checked",false);
                attx=attx.filter(p=>p!=temp);
            }
        }
        attxCode=attx.join("\n");
        $("#pasteArea").val(attx.join("\n"));
    })

//Mouseover high light the prt
    $(".each_prt").mouseover(function(){
        $(this).css("background-color","#F26363");

    }).mouseout(function(){
        $(this).css("background-color","#E997A7");
    })

    //add a button to show and close
    $('.hideTable').click(function(e){
        let hightLight=$('#hightLightPrt');
        let mainTable=$("#mainTable")
        if(this.id=="dar"){//switch to be hight Light mode
            this.id="hl";
            hightLight.show();
            mainTable.hide();
        }else{//switch to be dar mode
            this.id="dar";
            mainTable.show();
            hightLight.hide();
        }
    })

    $('.selectedRoute').click(function(e){
        let route=this.id.substr(2,this.id.length);
        //console.log(route)
        $(".da-pending").css({
            background:"white"
        });
        for(let i=0;i<prts.length;i++){
            let obj=prt[i];
            //if(obj.name.indexOf()
        }
    })

    $("#External").click(function(e){
        if(this.innerText==="External"){
            $(".each_prt").each(function(){
                $(this).find(".AppType")[0].value="External Appointment";
                $(this).find(".A_leg")[0].value="490078";
                $(this).find(".B_leg")[0].value="";
            })
            this.innerText="Attendance"
            isExternal=true;
            noteType=1
        }else{
            $(".each_prt").each(function(){
                $(this).find(".AppType")[0].value="Center Attendance"
                $(this).find(".A_leg")[0].value=$(this).find(".org_A_lag")[0].value;
                $(this).find(".B_leg")[0].value="490078";
            })
            this.innerText="External";
            isExternal=false;
            noteType=0
        }
        

    })

    $(".popOutCode").click(function(e){
        /*
        $("body").prepend(`<div id="pastedButtonDiv"><button id="pastedCode" class="btn btn-success">pastedCode</button></div>`)
        $("#pastedCode").css("z-index",999999)
        */
        $(".btn-block")[0].click()
        let createPastedCode = setInterval(function(){
            if($("#note_input").length>0){
                clearInterval(createPastedCode);
                $("#note_input").val(attxCode);
            }
        },1000)
        console.log(attxCode)
    })

    $("#Medication").click(function(e){
        if(this.innerText==="Medication"){
            $(".each_prt").each(function(){
                $(this).find(".AppType")[0].value="Medication";
                $(this).find(".B_leg")[0].value="490078";
                $(this).find(".A_leg")[0].value=$(this).find(".org_A_lag")[0].value;
                $(this).find(".endTime")[0].value="15:29"
                $(this).find(".prtNote")[0].value=80
            })
            this.innerText="Attendance"
            isExternal=true;
            noteType=2
        }else{
            $(".each_prt").each(function(){
                $(this).find(".AppType")[0].value="Center Attendance"
                $(this).find(".A_leg")[0].value=$(this).find(".org_A_lag")[0].value;
                $(this).find(".B_leg")[0].value="490078";
                $(this).find(".endTime")[0].value="15:30"
                $(this).find(".prtNote")[0].value=""
            })
            this.innerText="Medication";
            isExternal=false;
            noteType=0
        }
        

    })

    $("#Acupuncture").click(function(){
        document.getElementById("External").click();
        $(".B_leg").val("176624");
        $(".beginTime").val("1100");
        $(".endTime").val("1300");
        $(".AppType").val("Acupuncture");
        $(".prtNote").val(" KOKO ");
        //isExternal=true;
        //noteType=0
    })

    // Function

    function buildPrtList(prtId){
        let tempALeg=[
            /*prtId*/				prtId,
            /*pickUpTime*/			"",
            /*dropOffTime*/			$(`#${prtId}_Begin_Time`).val(),
            /*aLegLocId*/			$(`#${prtId}_A_leg_id`).val(),
            /*bLegLocId*/			$(`#${prtId}_B_leg_id`).val(),
            /*appt_type*/			$(`#${prtId}_appt_type`).val()
        ];
        let tempBLeg=[
            /*prtId*/				prtId,
            /*pickUpTime*/			$(`#${prtId}_End_Time`).val(),
            /*dropOffTime*/			"",
            /*aLegLocId*/			$(`#${prtId}_B_leg_id`).val(),
            /*bLegLocId*/			$(`#${prtId}_A_leg_id`).val(),
            /*appt_type*/			$(`#${prtId}_appt_type`).val()
        ];
        //alert($("#External").innerText)
        if(noteType==1){
            tempALeg.push(
            /*note*/				$(`#${prtId}_note`).val()
            )
            tempBLeg.push(
            /*note*/				$(`#${prtId}_note`).val()
            )
        }else if(noteType==2){

            tempALeg.push(
            /*note*/				"80"
            )
            tempBLeg.push(
            /*note*/				"80"
            )
        }else{
            tempALeg.push("")
            tempBLeg.push("")
        }

        let returnStrAM=$("#"+prtId+"_am").is(":checked")?tempALeg.join('\t')+"\n":"";
        let returnStrPM=$("#"+prtId+"_pm").is(":checked")?tempBLeg.join('\t'):"";


        return noteType==2?tempBLeg.join('\t'):(returnStrAM+returnStrPM)
    }



});