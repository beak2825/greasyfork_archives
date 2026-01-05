// ==UserScript==
// @name       Lending Club
// @namespace  http://geekminute.com/
// @version    0.8
// @description  Auto expand things on lending club
// @match      https://www.lendingclub.com/*
// @copyright  2015+, Jon Heizer
// @downloadURL https://update.greasyfork.org/scripts/10363/Lending%20Club.user.js
// @updateURL https://update.greasyfork.org/scripts/10363/Lending%20Club.meta.js
// ==/UserScript==

setTimeout(function() {  
    //If there are any errors on the screen, jump out
    if (document.querySelectorAll("#master_message-list > *").length > 0 && document.documentElement.innerHTML.indexOf('There was no activity during this period') > -1 )
    {
        return;
    }

    //Expand loan performance
    if (document.getElementById("showLoanPerf") !== null)
    {
        document.getElementById("showLoanPerf").getElementsByTagName("a")[0].click();
    }

    //Expand payment history
    if (document.getElementById("showPayments") !== null)
    {
        document.getElementById("showPayments").getElementsByTagName("a")[0].click();
    }

    //Account Activity
    if (document.getElementById("submitAccountDates") !== null && document.getElementById("lender-activity-div") === null)
    {
        var yest = new Date();
        yest.setDate(yest.getDate()-1);

        document.getElementById("start-date").value = (yest.getMonth() + 1).toString() + "/" + yest.getDate().toString() + "/" + yest.getFullYear().toString();
        document.getElementById("submitAccountDates").click();

    }

    setTimeout(function (){
        //If there are any errors on the screen, jump out
        if (document.querySelectorAll("#master_message-list > *").length > 0 && document.documentElement.innerHTML.indexOf('There was no activity during this period') > -1)
        {
            return;
        }

        //Any resizing combo
        var sel = document.querySelector("select[id^='yui-pg0-0']");

        if (sel !== null)
        {
            sel.value = 10000;

            if ('fireEvent' in sel)
                sel.fireEvent("onchange");
            else {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                sel.dispatchEvent(evt);
            }
        }
    },200);

    //Add totals to detail tables

    setTimeout(function (){
        TableTotals();
    },1000);

},500);

function TableTotals(){

    if (document.querySelectorAll("#detailPanel-div").length > 0)
    {
        //Give the table a moment to fill before calculating
        setTimeout(function (){
            var excess = 0;
            var excessCount  = 0;            
            var totalLine = document.querySelectorAll("div.bd div")[0];

            //Principal
            var prin = document.querySelectorAll("td.yui-dt-col-principal div");
            var ptotal = 0;
            for (i = 0; i < prin.length; ++i) {
                ptotal += parseFloat(prin[i].title.substr(1));
            }

            totalLine.innerHTML+= "&nbsp;&nbsp;&nbsp;&nbsp;<em>Principal:</em>&nbsp;<strong>$" + ptotal.toFixed(2).toString() + "</strong>";

            //Interest
            var intr = document.querySelectorAll("td.yui-dt-col-interest div");
            var itotal = 0;
            for (i = 0; i < intr.length; ++i) {
                itotal += parseFloat(intr[i].title.substr(1));                

                //Check for excess payments
                if (parseFloat(intr[i].title.substr(1)) == 0 || (parseFloat(intr[i].title.substr(1)) > .01 && parseFloat(prin[i].title.substr(1)) > (7 * parseFloat(intr[i].title.substr(1))))){
                    excessCount +=1;
                    excess += parseFloat(prin[i].title.substr(1))
                    }


        }

                   totalLine.innerHTML+= "&nbsp;&nbsp;<em>Interest:</em>&nbsp;<strong>$" + itotal.toFixed(2).toString() + "</strong>";

        totalLine.innerHTML+= "&nbsp;&nbsp;<em>Count:</em>&nbsp;<strong>" + (intr.length).toString() + "</strong>";
        
        if(excess > 0)
        {
            totalLine.innerHTML+= "&nbsp;&nbsp;<em>Excess:</em>&nbsp;<strong>" + (excessCount).toString() + " - $" + excess.toFixed(2).toString() + "</strong>";
        }
        
    },1000);
}else{
    setTimeout(function (){
        TableTotals();
    },1000);

}

}

addGlobalStyle('body #master_banner {padding-top: 5px; !important; }');
addGlobalStyle('#master_banner span a { height: 16px; !important; }');
addGlobalStyle('#master_top-nav { padding: 0px; !important; }');
addGlobalStyle('#master_content-header h1 { font-size: 125%; padding-bottom: 1px; !important;}');
addGlobalStyle('.box-module label { padding-top: 2px; !important;}');
addGlobalStyle('.box-module { height: 100px; !important;}');
addGlobalStyle('.master_alert { font-size: .7em;     margin: 0px; !important;}');
addGlobalStyle('body #master_top-nav.master_fmenuExtended { padding: 0px; !important;}');
addGlobalStyle('div#lender-activity-page .filter-container { height: auto; !important;}');
addGlobalStyle('body.master_full-width #master_content-mid { margin-top: 0px; !important;}');
addGlobalStyle('div.yui-dt tr { height: 27px; !important;}');


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}