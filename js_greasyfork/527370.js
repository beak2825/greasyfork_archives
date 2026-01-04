// ==UserScript==
// @name         Ground.news
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Unbiased news access should be free and unlimited
// @author       blank
// @match        https://ground.news/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527370/Groundnews.user.js
// @updateURL https://update.greasyfork.org/scripts/527370/Groundnews.meta.js
// ==/UserScript==
const delay = ms => new Promise(res => setTimeout(res, ms));
async function free(){
    //console.log("running");
    await delay(5000);//reduce unlock time
    localStorage.articlesAccessed =[[]];
    try{
        document.querySelector('[class*="hideElementSiteWide flex sticky h-6 tablet:h-auto items-center top-0 z-1000 bg-focus text-dark-primary"]').style.display='none';
        document.querySelector('[class*="fixed z-[1000] left-0 right-0 dark:bg-dark-heavy bg-tertiary-light"]').setAttribute("class","hidden");
    }catch{}
    try{
        document.querySelector('[class*="fixed z-[1000] left-0 right-0 dark:bg-dark-heavy bg-tertiary-light"]').setAttribute("class","hidden");
        document.querySelector('[class*="mdd:hidden z-1000 top-0 sticky"]').style.display='none';
        alert("An error ocurred, if you are unable to access premium functionalities, refresh the page");
    }catch{}
    try{
        if(document.URL.match("ground.news/article").length==1){
            //console.log("article");
            let probJson=""
            let jsonStr=document.getElementsByTagName("script");
            let f=0;
            for(let x=0;x<jsonStr.length;x++){
                if(jsonStr[x].innerHTML.length>probJson.length){
                    probJson=jsonStr[x].innerText;
                    f=x;
                }
            }
            jsonStr=probJson.match("\\\"factuality.*corporation\\\":[0-9]*}");
            if(jsonStr==null){
                jsonStr=probJson.match("\\\\\"factuality.*corporation\\\\\":[0-9]*}")
            }
            jsonStr=jsonStr[0].replaceAll("\\","");
            jsonStr=JSON.parse(`{${jsonStr}}`);
            const [factualityDiv,ownershipDiv]=[document.querySelectorAll("[class*=\"flex w-full items-center justify-between\"]"),document.querySelectorAll("[class*=\"bg-light-light p-8px tablet:p-1_6 flex flex-col gap-1_2 w-full h-full text-12 dark:text-dark-gray-100 leading-tightest dark:bg-dark-light cursor-pointer\"]")];
            let [ownershipPercentage,ownershipNames,ownershipItems,ownerFinalColor,ownershipDisplayNames,ownershipPickPercentage]=[[],[],0,[0,""],[],0];
            let [prettyName,aname]=["",""];
            for(let key in jsonStr.ownership){
                ownershipPercentage.push(jsonStr.ownership[key]);
                if(key=="billionaire"){
                    ownershipNames.push("wealthyPrivateOwner");
                }else{ownershipNames.push(key);}
                if(key=="billionaire"){
                    aname="Wealthy Private Owner";
                    ownershipDisplayNames.push("Wealthy Private Owner");
                }else if(key=="telecom"){
                    aname="Telecommunications";
                    ownershipDisplayNames.push("Telecommunications");
                }else if(key=="privateEquity"){
                    aname="Private equity";
                    ownershipDisplayNames.push("Private equity");
                }else if(key=="mediaConglomerate"){
                    aname="Media Conglomerate";
                    ownershipDisplayNames.push("Media Conglomerate");
                }else if(key=="government"){
                    aname="Government";
                    ownershipDisplayNames.push("Government");
                }else if(key=="independent"){
                    aname="Independent news";
                    ownershipDisplayNames.push("Independent news");
                }else if(key=="corporation"){
                    aname="Corporation";
                    ownershipDisplayNames.push("Corporation");
                }else{
                    aname="Other";
                    ownershipDisplayNames.push("Other");
                }
                if(jsonStr.ownership[key]>ownerFinalColor[0]){
                    ownershipPickPercentage=jsonStr.ownership[key];
                    ownerFinalColor[1]=key;
                    ownerFinalColor[0]=jsonStr.ownership[key];
                    prettyName=aname;
                }
                ownershipItems+=jsonStr.ownership[key];
            }
            for(let x=0;x<ownershipPercentage.length;x++){
                ownershipPercentage[x]=(ownershipPercentage[x]/ownershipItems)*100;
            }
            ownershipPickPercentage=(ownershipPickPercentage/ownershipItems)*100;
            const removeBuyPremium= document.querySelectorAll('p:has(span.underline)');
            for(let x=0;x<removeBuyPremium.length;x++){
                removeBuyPremium[x].style.display='none';
            }
            try{
                factualityDiv[0]._tippy.reference.childNodes[1].style.display='none';
            }catch{}
            try{
                factualityDiv[0]._tippy.reference.childNodes[0].className='flex text-14 tablet:text-18 items-center';
            }catch{}
            try{
                ownershipDiv[0].children[0].childNodes[0].className="relative flex items-center";
            }catch{}
            try{
                ownershipDiv[0].children[0].childNodes[1].style.display="none";
            }catch{}
            try{
                if(ownerFinalColor[1]=="billionaire"){
                    ownershipDiv[0].children[2].className=`bg-mediaopoly-wealthyPrivateOwner text-center h-2_4`;
                }
                else{
                    ownershipDiv[0].children[2].className=`bg-mediaopoly-${ownerFinalColor[1]} text-center h-2_4`;
                }

            }catch{}
            let message = document.createElement("div");
            let tippyIndx=100;
            message.innerHTML=`<div data-tippy-root="" id="tippy-${tippyIndx}" style="pointer-events: none; z-index: 9999; position: relative; inset: 0px auto auto 0px; margin: 0px; display: none; width: 100rem;"><div class="tippy-box justify-end flex dark:bg-light-primary dark:text-dark-primary p-1_2 text-16 tablet:text-12 tippy_arrow__uqz_Z" data-state="visible" tabindex="-1" data-animation="fade" style="max-width: 350px; transition-duration: 300ms;" role="tooltip" data-placement="bottom"><div class="tippy-content" data-state="visible" style="transition-duration: 300ms;"><div><span>${prettyName}, ${ownershipPickPercentage.toFixed()}%</span></div></div><div class="tippy-arrow" style="position: absolute; left: 0px; transform: translate3d(50px, 0px, 0px);"></div></div></div>`;
            ownershipDiv[0].insertBefore(message,ownershipDiv[0].children[3]);
            document.querySelectorAll("[class*=\"bg-light-light p-8px tablet:p-1_6 flex flex-col gap-1_2 w-full h-full text-12 dark:text-dark-gray-100 leading-tightest dark:bg-dark-light cursor-pointer\"]")[0].children[2].onmouseenter=()=>{document.getElementById(`tippy-100`).style.display='block'};
            document.querySelectorAll("[class*=\"bg-light-light p-8px tablet:p-1_6 flex flex-col gap-1_2 w-full h-full text-12 dark:text-dark-gray-100 leading-tightest dark:bg-dark-light cursor-pointer\"]")[0].children[2].onmouseleave=()=>{document.getElementById(`tippy-100`).style.display='none'};
            try{
                ownershipDiv[0].children[4].className="";
            }catch{}
            tippyIndx++;
            ownershipDiv[0].children[4].children[0].innerHTML='';
            for(let add=0;add<ownershipNames.length;add++){
                ownershipDiv[0].children[4].children[0].innerHTML+=`<div class=" bg-mediaopoly-${ownershipNames[add]} text-center py-4px" style="width:${ownershipPercentage[add]}%" onmouseenter="document.getElementById('tippy-${tippyIndx}').style.display='block';" onmouseleave="document.getElementById('tippy-${tippyIndx}').style.display='none';"></div>`;
                ownershipDiv[0].children[4].innerHTML+=`<div data-tippy-root="" id="tippy-${tippyIndx}" style="pointer-events: none; z-index: 9999; position: relative; inset: 0px auto auto 0px; margin-top: 0.5rem; display: none; width: 100rem;"><div class="tippy-box justify-end flex dark:bg-light-primary dark:text-dark-primary p-1_2 text-16 tablet:text-12 tippy_arrow__uqz_Z" data-state="visible" tabindex="-1" data-animation="fade" style="max-width: 350px; transition-duration: 300ms;" role="tooltip" data-placement="bottom"><div class="tippy-content" data-state="visible" style="transition-duration: 300ms;"><div><span>${ownershipDisplayNames[add]}, ${ownershipPercentage[add].toFixed()}%</span></div></div><div class="tippy-arrow" style="position: absolute; left: 0px; transform: translate3d(50px, 0px, 0px);"></div></div></div>`;
                tippyIndx++;
            }
            //Do Facuality
            factualityDiv[0].children[0].className="flex text-14 tablet:text-18 items-center";
            factualityDiv[0].children[1].style.display="none";
            let [factuality,factualityItems,finalColor]=[0,0,[0,""]];
            let [facPrettyName,facAname,facNames,facPrettyNames,facPercentage,facFinalPercentage]=["","",[],[],[],0];
            for(let key in jsonStr.factuality){
                factualityItems+=jsonStr.factuality[key];
                facPercentage.push(jsonStr.factuality[key]);
                if(key=='veryLow'){
                    facAname="Very low";
                    factuality-=2*jsonStr.factuality[key];
                }else if(key=='low'){
                    facAname="Low";
                    factuality-=1*jsonStr.factuality[key];
                }else if(key=='high'){
                    facAname="High";
                    factuality+=1*jsonStr.factuality[key];
                }else if(key=="veryHigh"){
                    facAname="Very high";
                    factuality+=2*jsonStr.factuality[key];
                }else if(key=="mixed"){
                    facAname="Mixed";
                }else if(key=="unknown"){
                    facAname="Unknown";
                }
                facNames.push(key);
                facPrettyNames.push(facAname);
                if(jsonStr.factuality[key]>finalColor[0]){
                    finalColor[1]=key;
                    finalColor[0]=jsonStr.factuality[key];
                    facPrettyName=facAname;
                    facFinalPercentage=jsonStr.factuality[key];
                }
            }
            if(facPrettyName=="Unknown"){
                finalColor[1]="unkown bg-white";
            }
            try{
                document.querySelectorAll("[class*=\"bg-tertiary-light dark:bg-dark-light p-8px tablet:p-1_6 flex flex-col gap-1_2  justify-between w-full h-full text-12 dark:text-dark-gray-100 leading-tightest cursor-pointer\"]")[0].children[1].children[0].className=`bg-factuality-${finalColor[1]} text-center h-2_4`;
            }catch{}
            try{
                document.querySelectorAll("[class*=\"bg-tertiary-light dark:bg-dark-light p-8px tablet:p-1_6 flex flex-col gap-1_2  justify-between w-full h-full text-12 dark:text-dark-gray-100 leading-tightest cursor-pointer\"]")[0].children[1].children[1].className="";
            }catch{}
            for(let x=0;x<facPercentage.length;x++){
                facPercentage[x]=(facPercentage[x]/factualityItems)*100;
            }
            facFinalPercentage=(facFinalPercentage/factualityItems)*100;
            try{
                document.querySelectorAll("[class*=\"bg-tertiary-light dark:bg-dark-light p-8px tablet:p-1_6 flex flex-col gap-1_2  justify-between w-full h-full text-12 dark:text-dark-gray-100 leading-tightest cursor-pointer\"]")[0].children[1].children[1].children[0].innerHTML="";
            }catch{}
            //<div class="bg-factuality-low text-center py-4px" style="width:40%"></div>
            for(let x=0;x<facNames.length;x++){
                if(facNames[x]!="unknown"){
                    document.querySelectorAll("[class*=\"bg-tertiary-light dark:bg-dark-light p-8px tablet:p-1_6 flex flex-col gap-1_2  justify-between w-full h-full text-12 dark:text-dark-gray-100 leading-tightest cursor-pointer\"]")[0].children[1].children[1].children[0].innerHTML+=`<div class="bg-factuality-${facNames[x]} text-center py-4px" style="width:${facPercentage[x]}%" onmouseenter="document.getElementById('tippy-${tippyIndx}').style.display='block';" onmouseleave="document.getElementById('tippy-${tippyIndx}').style.display='none';"></div>`;
                }else{
                    document.querySelectorAll("[class*=\"bg-tertiary-light dark:bg-dark-light p-8px tablet:p-1_6 flex flex-col gap-1_2  justify-between w-full h-full text-12 dark:text-dark-gray-100 leading-tightest cursor-pointer\"]")[0].children[1].children[1].children[0].innerHTML+=`<div class="bg-white text-center py-4px" style="width:${facPercentage[x]}%" onmouseenter="document.getElementById('tippy-${tippyIndx}').style.display='block';" onmouseleave="document.getElementById('tippy-${tippyIndx}').style.display='none';"></div>`;
                }
                document.querySelectorAll("[class*=\"bg-tertiary-light dark:bg-dark-light p-8px tablet:p-1_6 flex flex-col gap-1_2  justify-between w-full h-full text-12 dark:text-dark-gray-100 leading-tightest cursor-pointer\"]")[0].children[1].children[1].innerHTML+=`<div data-tippy-root="" id="tippy-${tippyIndx}" style="pointer-events: none; z-index: 9999; position: relative; inset: 0px auto auto 0px; margin-top: 0.5rem; display: none; width: 100rem;"><div class="tippy-box justify-end flex dark:bg-light-primary dark:text-dark-primary p-1_2 text-16 tablet:text-12 tippy_arrow__uqz_Z" data-state="visible" tabindex="-1" data-animation="fade" style="max-width: 350px; transition-duration: 300ms;" role="tooltip" data-placement="bottom"><div class="tippy-content" data-state="visible" style="transition-duration: 300ms;"><div><span>${facPrettyNames[x]}, ${facPercentage[x].toFixed()}%</span></div></div><div class="tippy-arrow" style="position: absolute; left: 0px; transform: translate3d(50px, 0px, 0px);"></div></div></div>`;
                tippyIndx++;
            }
            let factualityMessage=document.createElement("div");
            factualityMessage.innerHTML=`<div data-tippy-root="" id="tippy-${tippyIndx}" style="pointer-events: none; z-index: 9999; position: relative; inset: 0px auto auto 0px; margin: 0px; display: none; width: 100rem;"><div class="tippy-box justify-end flex dark:bg-light-primary dark:text-dark-primary p-1_2 text-16 tablet:text-12 tippy_arrow__uqz_Z" data-state="visible" tabindex="-1" data-animation="fade" style="max-width: 350px; transition-duration: 300ms;" role="tooltip" data-placement="bottom"><div class="tippy-content" data-state="visible" style="transition-duration: 300ms;"><div><span>${facPrettyName}, ${facFinalPercentage.toFixed()}%</span></div></div><div class="tippy-arrow" style="position: absolute; left: 0px; transform: translate3d(50px, 0px, 0px);"></div></div></div>`;
            try{
                document.querySelectorAll("[class*=\"bg-tertiary-light dark:bg-dark-light p-8px tablet:p-1_6 flex flex-col gap-1_2  justify-between w-full h-full text-12 dark:text-dark-gray-100 leading-tightest cursor-pointer\"]")[0].children[1].insertBefore(factualityMessage, document.querySelectorAll("[class*=\"bg-tertiary-light dark:bg-dark-light p-8px tablet:p-1_6 flex flex-col gap-1_2  justify-between w-full h-full text-12 dark:text-dark-gray-100 leading-tightest cursor-pointer\"]")[0].children[1].children[1])
            }catch{}
            document.querySelectorAll("[class*=\"bg-tertiary-light dark:bg-dark-light p-8px tablet:p-1_6 flex flex-col gap-1_2  justify-between w-full h-full text-12 dark:text-dark-gray-100 leading-tightest cursor-pointer\"]")[0].children[1].children[0].onmouseenter=()=>{document.getElementById('tippy-116').style.display='block'};
            document.querySelectorAll("[class*=\"bg-tertiary-light dark:bg-dark-light p-8px tablet:p-1_6 flex flex-col gap-1_2  justify-between w-full h-full text-12 dark:text-dark-gray-100 leading-tightest cursor-pointer\"]")[0].children[1].children[0].onmouseleave=()=>{document.getElementById('tippy-116').style.display='none'};
        }
    }catch{}
    if(document.URL.match("ground.news/blindspot").length==1){
        let probJson=""
        let jsonStr=document.getElementsByTagName("script");
        let f=0;
        for(let x=0;x<jsonStr.length;x++){
            if(jsonStr[x].innerHTML.length>probJson.length){
                probJson=jsonStr[x].innerText;
                f=x;
            }
        }
        jsonStr=probJson.match("{.*}");
        //jsonStr=jsonStr[0].match("leftBlindspots.*}")[0].replaceAll("\\\\\"","'");
        jsonStr=jsonStr[0].replaceAll("\\\\\"","'");
        jsonStr=jsonStr.replaceAll("\\","");
        jsonStr=JSON.parse(jsonStr)
        //left=document.getElementsByClassName("grid grid-cols-1 gap-3_2 desktop:grid-cols-2 tablet:mt-3_2")[1]
        //right=document.getElementsByClassName("grid grid-cols-1 gap-3_2 desktop:grid-cols-2 tablet:mt-3_2")[2]
        //await delay(1000);
        let blind=1;
        //Adapt to new way of handling blindspot ids
        jsonStr=jsonStr.children[3];
        //console.log(jsonStr.leftBlindspotIds);
        for(let x in jsonStr.leftBlindspotIds){
            //document.getElementsByClassName("grid grid-cols-1 gap-3_2 desktop:grid-cols-2 tablet:mt-3_2")[1].innerHTML+=`<div class="group"><a href="https://ground.news/article/${jsonStr.leftBlindspotIds[x]}">Blindspot Number ${blind}</a></div>`;
            document.querySelectorAll("[class*=\"grid grid-cols-1 gap-3_2 desktop:grid-cols-2 tablet:mt-3_2\"]")[1].innerHTML+=`<div class="group"><a href="https://ground.news/article/${jsonStr.leftBlindspotIds[x]}">Blindspot Number ${blind}</a></div>`;
            blind+=1;
        }
        blind=1;
        //console.log(jsonStr);
        for(let x in jsonStr.rightBlindspotIds){
            //document.getElementsByClassName("grid grid-cols-1 gap-3_2 desktop:grid-cols-2 tablet:mt-3_2")[2].innerHTML+=`<div class="group"><a href="https://ground.news/article/${jsonStr.rightBlindspotIds[x]}">Blindspot Number ${blind}</a></div>`;
            document.querySelectorAll("[class*=\"grid grid-cols-1 gap-3_2 desktop:grid-cols-2 tablet:mt-3_2\"]")[2].innerHTML+=`<div class="group"><a href="https://ground.news/article/${jsonStr.rightBlindspotIds[x]}">Blindspot Number ${blind}</a></div>`;
            blind+=1;
        }
        //let response=await fetch(`https://ground.news/article/${jsonStr.leftBlindspotIds[0]}`);
        //response=await response.text();
        //console.log(response);
        await delay(1000);
        /*Blindspot format:
        <div class="group"><a class="flex flex-col gap-8px cursor-pointer" href="/article/the-democratic-civil-war-has-started-who-will-triumph_42deec"><div class="h-22 min-w-full object-cover  " style="position: relative;"><div class="w-full h-full relative overflow-hidden"><div class="w-full h-full object-cover blur-sm scale-110"><div class="relative w-full h-full"><div class="absolute inset-0 w-full h-full"><img alt="Democrats eye Republicans’ success with social media to transform messaging" fetchpriority="auto" loading="lazy" width="608" height="440" decoding="async" data-nimg="1" class="w-full h-full object-cover cover" style="color: transparent;" sizes="(max-width: 600px) 95vw, (max-width: 1200px) 50vw, 25vw" srcset="/_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=370&amp;q=75 370w, /_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=600&amp;q=75 600w, /_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=1024&amp;q=75 1024w, /_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=1440&amp;q=75 1440w" src="https://ground.news/_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=1440&amp;q=75"></div></div></div><div class="absolute inset-0 flex items-center justify-center"><img alt="Democrats eye Republicans’ success with social media to transform messaging" fetchpriority="auto" loading="lazy" width="608" height="440" decoding="async" data-nimg="1" class="max-w-full max-h-full object-contain" style="color: transparent;" sizes="(max-width: 600px) 95vw, (max-width: 1200px) 50vw, 25vw" srcset="/_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=370&amp;q=75 370w, /_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=600&amp;q=75 600w, /_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=1024&amp;q=75 1024w, /_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=1440&amp;q=75 1440w" src="https://ground.news/_next/image?url=https%3A%2F%2Fgrnd.b-cdn.net%2Fadmin%2F2025%2F2%2F3dad51a6d14a3c110fb7336a8848cbf02b439ab9.jpg%3F%26width%3D608%26crop%3D1769%2C1280%2C76%2C0%26quality%3D50&amp;w=1440&amp;q=75"></div></div><div class="absolute top-0 left-0 w-full h-full bg-dark-primary opacity-0 group-hover:opacity-25 group-hover:transition-opacity group-hover:duration-200 ease-in z-1"></div></div><div class="flex gap-4px justify-between"><div class="flex items-center gap-4px font-normal"><div class="icons_icon__RW1fQ undefined  cursor-pointer"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5303 16.773C15.1664 14.1369 15.1664 9.86307 12.5303 7.22703C9.8943 4.59099 5.62044 4.59099 2.9844 7.22703C0.348357 9.86307 0.348357 14.1369 2.9844 16.773C5.62044 19.409 9.8943 19.409 12.5303 16.773Z" stroke="#262626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21.0157 16.773C23.6517 14.1369 23.6517 9.86307 21.0157 7.22703C18.3797 4.59099 14.1058 4.59099 11.4697 7.22703C8.83371 9.86307 8.83371 14.1369 11.4697 16.773C14.1058 19.409 18.3797 19.409 21.0157 16.773Z" stroke="#262626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><rect x="13.5" y="7.5" width="8.25" height="1.5" fill="#262626"></rect><rect x="14.25" y="11.25" width="8.25" height="1.5" fill="#262626"></rect><rect x="13.5" y="15" width="8.25" height="1.5" fill="#262626"></rect></svg></div><span class="text-14">Blindspot:</span><button class="py-1/2 rounded-4px text-12 justify-self-start leading-6 flex flex-shrink items-center text-left  disabled:opacity-50 bg-ground-new-dark-red text-light-primary px-4px font-bold">Only 10% Left</button></div><span class="text-14 font-normal">12 sources</span></div><h4 title="Democrats eye Republicans’ success with social media to transform messaging" class="font-extrabold text-22 leading-11 line-clamp-3 tablet:min-h-8_2 desktop:min-h-full group-hover:underline">Democrats eye Republicans’ success with social media to transform messaging</h4><div class="mt-8px flex flex-col gap-8px"><div class="flex flex-col gap-3px"><div class="flex justify-between text-14 leading-6 font-normal"><span>Left</span><span>10%</span></div><div class="text-12 flex"><div class="bg-ground-new-dark-red h-6px" style="width: 10%;"></div><div class="bg-light-light h-6px" style="width: 90%;"></div></div></div><div class="flex flex-col gap-3px"><div class="flex justify-between text-14 leading-6 font-normal"><span>Center</span><span>10%</span></div><div class="text-12 flex"><div class="bg-secondary-neutral h-6px" style="width: 10%;"></div><div class="bg-light-light h-6px" style="width: 90%;"></div></div></div><div class="flex flex-col gap-3px"><div class="flex justify-between text-14 leading-6 font-normal"><span>Right</span><span>80%</span></div><div class="text-12 flex"><div class="bg-ground-new-dark-blue h-6px" style="width: 80%;"></div><div class="bg-light-light h-6px" style="width: 20%;"></div></div></div></div></a></div>
        */
        try{
            document.querySelector("[class*=\"relative text-18 w-full tablet:h-30 overflow-y-hidden col-span-12 font-normal\"]").style.display="none";
        }catch{}

    }
}
if(window.attachEvent) {
    window.attachEvent('onload', free);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            free(evt);
        };
        window.onload = newonload;
    } else {
        window.onload = free;
    }
}
document.onclick=async function(){
    try{
        await delay(2000);
        if(document.URL.match("ground.news/article").length==1){
            if(document.querySelector('[class*="fixed z-[1000] left-0 right-0 dark:bg-dark-heavy bg-tertiary-light"]')!=null){
                location.reload();
            }
        }else if(document.URL.match("ground.news/blindspot").length==1){

        }
    }catch{}
};