// ==UserScript==
// @name  Endor Mic2
// @version  0.1
// @description  A key triggers Mic, S key triggers play, D key triggers submit
// @author  Kerek, Cristo
// @include  https://www.google.com/evaluation/endor*
// @include  https://www.mturk.com/*
// @exclude  https://www.mturk.com/mturk/myhits*
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/15107/Endor%20Mic2.user.js
// @updateURL https://update.greasyfork.org/scripts/15107/Endor%20Mic2.meta.js
// ==/UserScript==

if (window.location.href.indexOf('https://www.mturk.com/')!=-1)
{
    window.addEventListener("message", function(l){
        if( l.data == "return")
        {
            $('a[href^="/mturk/return?"]')[0].click();
        }
    });
}
else if (window.location.href.indexOf('google.com/evaluation/endor')!=-1)
{

    var task = 0;
    var wig0 = document.getElementById("widget0");
    if (wig0)
    {
        var kid0 = wig0.getElementsByTagName("div")[0];
        var rec0 = kid0.getElementsByTagName("div")[0].firstChild.firstChild;
        var play0 = kid0.getElementsByTagName("div")[5].firstChild.firstChild;
        console.log(rec0);
        console.log(play0);

        var wig1 = document.getElementById("widget1");
        var kid1 = wig1.getElementsByTagName("div")[0];
        var rec1 = kid1.getElementsByTagName("div")[0].firstChild.firstChild;
        var play1 = kid1.getElementsByTagName("div")[5].firstChild.firstChild;

        console.log(document.getElementById("prompt2").style.display);

        document.addEventListener( "keydown", function(i) {
            if (i.keyCode == 65) { //A
                if (task == 0)
                {
                    var trig = document.createEvent("MouseEvents");
                    trig.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    rec0.dispatchEvent(trig);

                }
                else
                {
                    var trig = document.createEvent("MouseEvents");
                    trig.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    rec1.dispatchEvent(trig);
                }
            }
            if (i.keyCode == 83) { //S
                if (task == 0)
                {
                    var trig = document.createEvent("MouseEvents");
                    trig.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    play0.dispatchEvent(trig);
                    task++;
                }
                else
                {
                    var trig = document.createEvent("MouseEvents");
                    trig.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    play1.dispatchEvent(trig);
                }
            }
            if (i.keyCode == 68) { //D
                if(document.getElementById("prompt2").style.display != "none")
                {
                    document.getElementsByTagName("input")[0].click();
                }
            }
        });
    }
    else
    {
        document.addEventListener( "keydown", function(i) {
            if(i.keyCode == 82) //R
            {
                parent.postMessage("return",'*');
            }
            else if (i.keyCode == 70) //F
            {
                location.reload(true);
            }
        });
    }
}