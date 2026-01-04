// ==UserScript==
// @name         NewPmRoute
// @namespace    https://www.conanluo.com/
// @version      1.13
// @description  Build a list
// @author       Conan
// @match        *://*.conanluo.com/pmroute.html
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itinerisonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477372/NewPmRoute.user.js
// @updateURL https://update.greasyfork.org/scripts/477372/NewPmRoute.meta.js
// ==/UserScript==
(function () {
    'use strict';



    let fakeDate = "09/30/2023 "; //fake date only for compare
    let pmTime = "15:30:00";
    let drivers = [
        "Bert Reid",
        "Crystal Calloway",
        "Mauricio Reina",
        "Yingyang Chen",
        "Manuel Reina",
        "Jerald Alejandro",
        "Walter Mejia",
        "Fook Fung",
        "Kang Li",
        "Han Yang Zhou",
        "Wilson Ochoa"
    ];
    let driverInfo = {
        "Bert Reid": "10",
        "Crystal Calloway": "08",
        "Mauricio Reina": "02",
        "Yingyang Chen": "09",
        "Manuel Reina": "03",
        "Jerald Alejandro": "04",
        "Walter Mejia": "06",
        "Fook Fung": "01",
        "Kang Li": "05",
        "Han Yang Zhou": "2Joe",
        "Wilson Ochoa": "3Wilson"
    };
    let today=new Date();
    $("#today").html((today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear())
    /*
        let driverInfo={
            "Bert Reid":10,
            "Crystal Calloway":8,
            "Mauricio Reina":2,
            "Yingyang Chen":9,
            "Manuel Reina":3,
            "Jerald Alejandro":4,
            "Walter Mejia":6,
            "Fook Fung":1,
            "Kang Li":5,
            "Han Yang Zhou":"Joe",
            "Wilson Ochoa":"Wilson"
        }
    */
    function sortBy(keyWord) {
        return function (m, n) {
            let a = m[keyWord].toLowerCase();
            let b = n[keyWord].toLowerCase();
            if (a < b) return -1;
            if (b < a) return 1;
            return 0;
        };
    }

    function sortByTime() {
        return function (m, n) {
            let a = fakeDate + m.time;
            let b = fakeDate + n.time;
            if (a < b) return -1;
            if (b < a) return 1;
            return 0;
        };
    }

    function getNum(str){
        return str=="10"?10:(str.substr(1,str.length))
    }

    $(".my-btn").click(function () {
        console.log(this.id)
        let pmTable = $("#pmTable");
        let trips = $("#trips").val();

        let groups = [];


        let prtsArr = trips.split("\n");

        for (let i = 1; i < prtsArr.length; i++) {
            let keys = prtsArr[0].split("\t");
            let o = '{';
            for (let j = 0; j < keys.length; j++) {
                //o={};
                //o[`${keys[j].replace(" ","_")}`]=prtsArr[i][j];
                //o=o+`"${keys[j].replace(" ","_")}":"${prtsArr[i][j]}"`
                let key = "";
                let val = prtsArr[i].split("\t");
                let chk = keys[j];
                if (chk == "Driver Name") {
                    key = "driver";
                } else if (chk == "PassengerName") {
                    key = "prt";
                } else if (chk == "ServiceCode") {
                    key = "wheelchair";
                } else if (chk == "PickupOrdered") {
                    key = "time";
                }
                if (key != "") {
                    o = o + `"${key}":"${val[j]}"`;
                }
                if (key != "") o = o + ",";
            }
            o = o.substr(0, o.length - 1);
            o = o + "}";
            let obj = JSON.parse(o);
            if (drivers.indexOf(obj.driver) >= 0) {

                //console.log(`${fakeDate+obj.time}>${fakeDate+pmTime}---${fakeDate+obj.time>=fakeDate+pmTime}`)
                if (!(fakeDate + obj.time >= fakeDate + pmTime)) {
                    continue;
                }
                if (obj.wheelchair == "Wheelchair") { // replace Wheelchair
                    obj.wheelchair = 'w';
                } else {
                    obj.wheelchair = "";
                }
                obj.rtNum = driverInfo[obj.driver];




                groups.push(obj);

            }
            //groups.push((o))
        }

        if(this.id=="route"){
            groups.sort(sortBy("prt"));
            groups.sort(sortBy("rtNum"));
        }else{

            groups.sort(sortBy("prt"));
        }

            //groups.sort(sortByTime())
        let boder_style='border-secondary';
        let bg_style='bg-dark-subtle';
        let tableHtml = `<table style="border:1px">
                         <tr>
                            <!--<th class="border border-dark ${bg_style}"></th>-->
                            <th class="border border-dark ${bg_style}">Prt</th>
                            <th class="border border-dark ${bg_style}">Rt#</th>
                            <th class="border border-dark ${bg_style}">W</th>

                            <th class="border border-dark ${bg_style}">&nbsp;</th>
                            <!--<th class="border border-dark ${bg_style}"></th>-->
                            <th class="border border-dark ${bg_style}">Prt</th>
                            <th class="border border-dark ${bg_style}">Rt#</th>
                            <th class="border border-dark ${bg_style}">W</th>
                         </tr>`;
        
        let row = parseInt(groups.length / 2 + .6);
        for (let i = 0; i < row; i++) {
            let r = parseInt(i + row);
            try{
                tableHtml += `<tr style="color:black">
                <!--<td>${i+1}</td>-->
                <td class="border border-dark">${groups[i].prt}</td>
                <td class="border border-dark">${getNum(groups[i].rtNum)}</td>
                <td class="border border-dark">${groups[i].wheelchair}</td>
                <td class="border border-dark ${bg_style}"></td>
                <!--<td>${r+1}</td>-->`
                let r_prt="",r_rtNum="",r_wheelchair=""
                if(r<groups.length){
                    r_prt=groups[r].prt
                    r_rtNum=getNum(groups[r].rtNum)
                    r_wheelchair=groups[r].wheelchair
                }
                tableHtml+=`
                <td class="border border-dark">${r_prt}</td>
                <td class="border border-dark">${r_rtNum}</td>
                <td class="border border-dark">${r_wheelchair}</td>
                </tr>`;
            }catch(e){

            }
        }

        tableHtml += `</table>`;
      
        pmTable.html(tableHtml);
        
        //pmTable.text(JSON.stringify(groups))
        //alert(groups[5].prt)
        //console.log(groups.length/2)

        $("#textarea").hide()
        $("#pmTable").show()
        console.log(groups.length,row)
        console.log(groups[32].prt,groups[33].prt)
    });

    $("#today").click(function(){
        //console.log(this.id)
        $("#textarea").show()

        $("#pmTable").hide()
    })

    // Your code here...
})();
