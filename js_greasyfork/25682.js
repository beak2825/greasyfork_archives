// ==UserScript==
// @name         Video Timer Skipper
// @namespace    https://greasyfork.org/en/users/2329-killerbadger
// @version      0.1
// @description  Will skip
// @author       You
// @match        http://www.auroravid.to/video/*
// @match        http://clicknupload.me/*
// @match        http://www.cloudtime.to/video/*
// @match        http://daclips.in/*
// @match        http://go4up.com/rd/*
// @match        http://gorillavid.in/*
// @match        http://movpod.in/*
// @match        http://www.multiup.org/en/download/*
// @match        http://www.nowvideo.sx/video/*
// @match        http://prem.link/dl/*
// @match        http://streamin.to/*
// @match        http://www.toofile.com/*
// @match        http://vid.ag/*
// @match        http://vodlocker.com/*
// @match        http://vidce.tv/*
// @match        http://thevideo.me/*
// @match        http://videowood.tv/embed/*
// @match        http://vidzi.net/*
// @match        http://earn-money-onlines.info/*
// @match        http*://clicknupload.link/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25682/Video%20Timer%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/25682/Video%20Timer%20Skipper.meta.js
// ==/UserScript==
hn = window.location.hostname; //alert(hn);
if(hn=='daclips.in' || hn=='movpod.in' || hn == 'gorillavid.in') {
    btn = document.getElementById('btn_download');
    btn.disabled = false;
    btn.value = 'Continue';
    btn.click();
} 
else if( hn == 'www.auroravid.to') { //alert('got to host');
    //var btnForm = document.forms[0];
    var btn = document.getElementsByClassName('btn')[0];
                                    //alert(btn);
    if(btn!==null && btn.form!==null) { //alert('trying to submit'); //check for form so that once on the video page, the download this video button is not clicked
        btn.click(); //player is embeded on the page. could just redirect to http://www.cloudtime.to/embed/?v=*VidID* from http://www.cloudtime.to/video/*VidID*  -- only loss would be loosing the title.
        //setTimeout(function(){ btn.form.submit(); alert('got past submit');}, 1000);  //didn't work as intended
    }
}
else if( hn == 'clicknupload.link') { //alert('got to host');
    //This function does more than is needed. Probably only the form.submit is necessary
    // Enable and Click button 
    
    btn0 = document.getElementById('method_free'); //alert(btn0);
    if(btn0) { //checks for button, and waits a bit before clicking
        btn0.click();
        
    } 
    //alert('got to btn');
    //tmr = document.getElementById('countdown_str';
    btn = document.getElementById('downloadbtn'); //alert(btn.innerHTML);
    if(btn) { //checks for button, and waits a bit before clicking
      /*  alert('got into btn'); //alert(btn.onClick);
        //alert(document.getElementById('countdown_str').innerHTML);
        if(btn.onClick!='undefined') { alert(btn.onClick);
            downURL = extractURL(btn.onClick, "window.open('", "');"); alert(downURL);
            redirect(downURL);
        }
        else {*/
            btn.click();
       // }
        //setTimeout(function(){ btn.click(); }, 1000);
    }
    
}
else if( hn == 'clicknupload.me') { //alert('got to host');
    //This function does more than is needed. Probably only the form.submit is necessary
    // Enable and Click button 
    /*
    btn0 = document.getElementsByName('method_free')[0]; alert(btn0);
    if(btn0) { //checks for button, and waits a bit before clicking
         //setTimeout(function(){ btn0.form.submit(); }, 1000);
        //document.getElementsByTagName("html")[0].click();
       //btn0.form.submit(); alert('got through btn0');
        //btn0.click();
    } 
    alert('got to btn');
    tmr = document.getElementById('countdown_str';
    btn = document.getElementById('btn_download'); //alert(btn.innerHTML);
    if(tmr) { //checks for button, and waits a bit before clicking
        alert('got into btn');
        alert(document.getElementById('countdown_str').innerHTML);
        setTimeout(function(){ btn.click(); }, 1000);
    }
    */
}
else if( hn == 'www.cloudtime.to') { //alert('got to host');
    //var btnForm = document.forms[0];
    var btn = document.getElementsByClassName('btn')[0];
                                    //alert(btn);
    if(btn!==null && btn.form!==null) { //alert('trying to submit'); //check for form so that once on the video page, the download this video button is not clicked
        btn.click(); //player is embeded on the page. could just redirect to http://www.cloudtime.to/embed/?v=*VidID* from http://www.cloudtime.to/video/*VidID*  -- only loss would be loosing the title.
        //setTimeout(function(){ btn.form.submit(); alert('got past submit');}, 1000);  //didn't work as intended
    }
}
else if( hn == 'earn-money-onlines.info') { //alert('got to host');
    var passBox = document.getElementsByName('post_password')[0];
    if(passBox){
        passBox.value = '300mbfilms';
        document.forms[0].submit();
    }
    var links = document.links;
    for( i=0; i<document.links.length; i++ )
    {
        //This is the old patter - they changed to LinkShrink, which I made a separate script for.
        //I'm leaving this in since it shouldn't negatively impact performance (noticably) and incase they switch back.
        var pattern = /redirect.php/i;
        if(pattern.test(document.links[i].href) )
        {
            document.links[i].href = extractURL(document.links[i].href, 'url=');
        }
        var pattern2 = /sh.st\/st/i;
        if(pattern2.test(document.links[i].href) )
        {
            document.links[i].href = extractURL(document.links[i].href);
        }
    }
}
else if( hn =='fastvideo.in') {
    btn = document.getElementById('btn_download');
    btn.disabled = false;
    document.getElementById('cxc').innerHTML='0';
    btn.value = 'Continue';
    btn.click();
}
else if( hn =='go4up.com') {//alert('got to host');
    var linkList = document.getElementById('linklist'); 
    link = extractURL(linkList, 'http', '">http'); 
    if(link!==null) { 
        redirect(link);
    }
}
else if( hn == 'www.nowvideo.sx') { //alert('got to host');
    //var btnForm = document.forms[0];
    var btn = document.getElementsByClassName('btn')[0];
                                    //alert(btn);
    if(btn!==null && btn.form!==null) { //alert('trying to submit'); //check for form so that once on the video page, the download this video button is not clicked
        btn.click(); //player is embeded on the page. could just redirect to http://www.cloudtime.to/embed/?v=*VidID* from http://www.cloudtime.to/video/*VidID*  -- only loss would be loosing the title.
        //setTimeout(function(){ btn.form.submit(); alert('got past submit');}, 1000);  //didn't work as intended
    }
}
else if( hn =='www.multiup.org') {
    var a = window.location.href;
    a = a.replace('/download/','/mirror/');
    redirect(a);
}
else if( hn == 'prim.link') {
    document.getElementById("myModalablock").style.display = 'none';
    document.getElementById("download_link").style.display = 'block';
    
}
else if( hn == 'streamin.to') {//alert(document.getElementById('cxc').innerHTML);
    // Remove overlay
    //var overlay = document.getElementById('impo_overlay');
    //overlay.parentNode.removeChild(overlay);
    
    // Enable and Click button
    btn = document.getElementById('btn_download');
    document.getElementById('cxc').innerHTML='0';
    if(btn) { //checks for button, and waits a bit before clicking
        btn.setAttribute('disabled',''); //alert('got inside');
        setTimeout(function(){ btn.form.submit(); }, 4000);
    }    
}
else if( hn == 'thevideo.me') {
    btn = document.getElementById('btn_download');
    if(btn) { //checks for button, and waits a bit before clicking
        //alert('got inside');
        setTimeout(function(){ btn.form.submit(); }, 10);
    }
    else { // if on the video page, remove the add over the video
        var ad = document.getElementById('fci');
        if(ad){
            ad.parentNode.removeChild(ad);
        }
    }
    
}
else if( hn == 'www.toofile.com') {
    //derp = document.getElementById('countdown_str').innerHTML;
    //alert(derp);
    firstBtns = document.getElementsByName('method_free');
    if(firstBtns.length>0) {
        firstBtns[0].click();
    }
    
    counter = document.getElementById('countdown_str');
    if(counter) {
        counter.style.display='none';
        btn = document.getElementById('btn_download');
        btn.disabled = false;
    }
}
else if( hn == 'vid.ag') {//alert(document.getElementById('cxc').innerHTML);
    // Remove overlay
    //var overlay = document.getElementById('impo_overlay');
    //overlay.parentNode.removeChild(overlay);
    
    // Enable and Click button
    btn = document.getElementById('btn_download');
    document.getElementById('cxc').innerHTML='0';
    if(btn) { //checks for button, and waits a bit before clicking
        setTimeout(function(){ btn.click(); }, 4000);
    }  
}
else if( hn == 'vodlocker.com') {//alert(document.getElementById('cxc').innerHTML);
    //This function does more than is needed. Probably only the form.submit is necessary
    // Enable and Click button
    btn = document.getElementById('btn_download');
    document.getElementById('cxc').innerHTML='0';
    if(btn) { //checks for button, and waits a bit before clicking
        btn.setAttribute('disabled',''); //alert('got inside');
        setTimeout(function(){ btn.form.submit(); }, 100);
    }
}
else if( hn == 'vidce.tv') {//alert(document.getElementById('cxc').innerHTML);
    //This function does more than is needed. Probably only the form.submit is necessary
    // Enable and Click button
    btn0 = document.getElementById('method_free');
    if(btn0) { //checks for button, and waits a bit before clicking
         //setTimeout(function(){ btn0.form.submit(); }, 1000);
        //document.getElementsByTagName("html")[0].click();
       // btn0.form.submit();
        btn0.click();
    }
    btn = document.getElementById('downloadbtn');
    if(btn) { //checks for button, and waits a bit before clicking
         btn.click();
    }
    btn2 = document.getElementById('vid_play');
    if(btn2) { //checks for button, and waits a bit before clicking
         btn2.click();
    }
}
else if( hn == 'videowood.tv') {//alert('got to hn');
    btn = document.getElementById('closeb'); 
    if(btn) { 
         btn.click();
    }
    window.setTimeout(function(){ //repeatedly checks for the button
        btn = document.getElementById('closeb');
        if(btn) { //checks for button, and waits a bit before clicking
          btn.click();
       }
    }, 1000);
}
else if( hn == 'vidzi.net') {
    btn0 = document.getElementsByName('method_free')[0]; 
    if(btn0) { 
         btn0.click();
    }
    btn = document.getElementById('btn_download');
    if(btn) {
        btn.click();
    }
    btn2 = document.getElementById('vid_play');
    if(btn2) {
        btn2.click();
    }
}
function redirect(nLoc) {
    document.title = 'Redirecting...';
    window.location.replace(nLoc);
}
function extractURL(rawElement, startString, endString) {
    b = String(rawElement.innerHTML);
    if(typeof endString !== "undefined") {
        newLoc = b.substring(b.indexOf(startString),b.indexOf(endString));
    }
    else if(typeof startString !== "undefined") {
        preString = startString;
        newLoc = rawElement.substring(rawElement.indexOf(preString)+preString.length);
    }
    else{
        preString = '/http';
        //b = rawElement.innerHTML;
        rawString = String(rawElement);
        newLoc = rawString.substring(rawString.indexOf(preString)+1);
    }
    return newLoc;
}
