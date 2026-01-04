// ==UserScript==
// @name         RoutePrt
// @namespace    https://www.conanluo.com/
// @version      1.2.12
// @description  route the route
// @author       Conan
// @match        https://*.itinerisonline.com/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @ require      https://work.conanluo.com/prts_info.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itinerisonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480726/RoutePrt.user.js
// @updateURL https://update.greasyfork.org/scripts/480726/RoutePrt.meta.js
// ==/UserScript==

(function() {

    'use strict';  
    //let addrs={"4145 Lincoln Way":"9","6102 California Street":"1","2525 Balboa Street":"1","955 Broderick Street":"8","275 10th Street":"4","2315 25th Avenue":"10","2442 33rd Avenue":"10","2535 35th Avenue":"9","201 Charter Oak Avenue":"5","72 Broad Street":"2","246 McAllister Street":"4","1609 Cayuga Avenue":"2","205 Clayton Street":"8","838 Pacific Avenue":"3","3627 Moraga Street":"9","1025 Fillmore Street":"8","471 19th Avenue":"1","1770 19th Avenue":"10","1099 Fillmore Street":"8","533 29th Avenue":"1","345 6th Street":"4","875 34th Avenue":"1","1001 Franklin Street":"8","2567 22nd Avenue":"10","574 21st Avenue":"1","629 Larch Way":"8","1419 48th Avenue":"9","670 Eddy Street":"4","1643 42nd Avenue":"9","1250 Haight Street":"8","1671 44th Avenue":"9","53 Colton Street":"11","1665 Chestnut Street":"3","2447 19th Avenue":'10',"735 Ellis Street":"4","1624 Noriega Street":"10","1900 29th Avenue":"10","2770 Lombard Street":"3","624 9th Avenue":"1","2535 38th Avenue":"9","1667 Silver Avenue":"5","705 Frederick Street":"11","468 3rd Avenue":"1","2220 Turk Boulevard":"2","1880 Fulton Street":"8","5767 Mission Street":"2","345 Arguello Boulevard":"1","750 5th Avenue":"1","171 Farallones Street":"2","345 6th Street 307":"4","358 21st Avenue 2":"1","1790 9th Avenue":"10","1066 Mission Street":"4","1100 Van Ness Avenue":"4","118 Taylor Street":"4","1201 Golden Gate Avenue":"8","1215 Ellis Street":"4","1223 Webster Street":"8","1234 McAllister Street":"8","1240 Fillmore Street":"8","1250 Pierce Street":"8","1285 Monteray Blvd":"2","1285 Monterey Boulevard":"2","129 Girard Street":"6","1301 Stevenson Boulevard":"0","1310 15th Avenue":"10","1316 Stockton Street":"3","1321 Mission Street":"4","1333 Bush Street":"4","135 Capp Street":"5","14 Roemer Way":"11","1420 Hampshire Street":"5","1423 32nd Avenue":"10","1426 Rivera Street":"10","1444 McAllister Street":"8","1458 21st Avenue":"10","1499 Webster St":"8","1510 Jerrold Avenue":"5","1542 36th Avenue":"9","1551 Hyde Street":"3","1559 27th Avenue":"10","159 Bright Street":"2","159 Sagamore Street":"2","1634 41st Avenue":"9","1635 23rd Avenue":"10","1645 Pacific Avenue":"3","165 Amherst Street":"6","1660 Geary Boulevard":"0","1667 Silver Avenue":"5","1675 Scott Street":"0","1680 Eddy Street":"8","1683 44th Avenue":"9","1722 Turk Street":"8","1723 Geneva Avenue":"6","1731 45th Avenue":"9","1735 Steiner Street":"8","174 Ellis Street":"4","1755 O'Farrell Street":"8","1797 Ellis Street":"8","1814 32nd Avenue":"10","1870 36th Avenue":"9","1880 Pine Street":"3","191 Evelyn Way":"2","1927 32nd Avenue":"10","1937 20th Avenue":"10","1975 45th Avenue":"9","2 Watt Avenue":"2","2014 34th Avenue":"9","2034 34th Avenue":"9","2034 43rd Avenue":"9","2051 46th Avenue":"9","2063 18th Avenue":"10","2107 O'Farrell Street":"0","211 Sweeny Street":"6","2116 17th Avenue":"10","2141 Geary Boulevard APT 101":"8","2143 21st Avenue":"10","216 Eddy Street":"4","2179 30th Avenue":"10","2187 30th Avenue":"10","2191 45th Avenue":"9","225 30th Street":"1","2279 25th Avenue":"10","23 Glenview Drive":"2","2318 43rd Avenue":"9","2330 Post Street 6th Floor":"8","2340 Turk Boulevard":"2","2351 20th Avenue":"10","2456 Geary Boulevard":"8","2459 28th Avenue":"10","25 Buckingham Way":"2","2517 Post Street":"8","2560 21st Avenue":"10","259 Broad Street":"2","2595 43rd Avenue":"9","2611 34th Avenue":"9","2698 California Street Apt C":"8","27 Hollywood Court":"2","2709 Balboa Street":"1","2740 California Street":"8","2770 Lombard Street":"3","302 Silver Avenue":"6","31 Arleta Avenue":"6","320 Clementina Street":"4","330 Cordova Street":"2","350 Ellis Street":"4","350 Gaven Street":"6","350 University Street":"6","350 University Street":"6","355 Faxon Avenue":"2","3575 Geary Boulevard":"0","358 21st Avenue":"1","3595 Geary Boulevard":"0","3595 Geary Boulevard":"0","364 4th Avenue":"1","365 Fulton Street":"8","367 Hale Street":"6","3683 Peralta Boulevard":"5","370 Valencia Street":"5","3981 Alemany Boulevard APT 214":"2","410 China Basin Street":"3","4116 Ulloa Street":"9","420 Berry Street":"4","4220 Judah Street":"9","425 Eddy Street":"4","426 Burrows Street":"6","465 11th Avenue":"1","468 Amherst Street":"6","468 Amherst Street":"6","4735 California Street":"1","4735 California Street 2":"1","4830 Mission Street":"2","491 31st Avenue":"1","500 33rd Avenue":"1","506 41st Avenue":"11","520 Jones Street":"4","528 Valencia Street":"5","528 Valencia Street 403":"5","5328 Fulton Street":"1","533 29th Avenue ":"1","537 Kansas Street":"5","562 6th Avenue":"1","5628 California Street":"1","5717 Geary Boulevard":"1","580 Capp Street":"5","614 7th Avenue":"1","622 Geneva Avenue":"6","627 21st Avenue":"1","640 Turk Street":"4","663 38th Avenue":"1","688 27th Street":"0","701 Golden Gate Avenue":"4","706 Columbus Avenue":"3","711 Pacific Avenue":"3","730 Eddy Street":"4","737 Folsom Street":"4","76 Newton Street":"2","770 18th Avenue":"1","779 15th Avenue":"1","801 Howard Street":"4","801 Howard Street":"4","848 Kearny Street":"3","858 Washington Street":"3","890 29th Avenue":"1","945 Sacramento Street":"3","990 Polk Street":"4","995 Brussels Street":"6"}

    let colors=["000000","b51548","188225","f3f600","AAAA00","443ea1","b1f9d1","aa77aa","01b4fa","f685e6","e08536","dddddd"]

    let address=[];
    $("body").prepend(`<button id="ch" class='btn btn-success'>Hight Light Route</button>
    <button id="popPmRoute" class='btn btn-danger'>pop Pm Route</button>`)

    async function delay(time){
        return new Promise((res,rej)=>{
            setTimeout(_=>res(),time)
        })
    }

    $("#ch").click(function(){
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
            $("#show_route_color").html(colorHtml+'</div>')

            // $("#ch").text(address.join("@"))
        })();
    })
    
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

            let url="https://work.conanluo.com/popPmRoute.html?"
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

            window.open(url+"arr="+param)

            //finished then relocate
            //document.location.href="www.baidu.com"
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
})();