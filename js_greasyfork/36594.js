// ==UserScript==
// @name         漢克起床!!!
// @namespace    http://tampermonkey.net/
// @version      1.00.50
// @description  message transmission
// @author       cs12341795 & bardisgod
// @match        http://acgn-stock.com/instantMessage
// @match        https://acgn-stock.com/instantMessage
// @grant        UMP40好可愛～
// @downloadURL https://update.greasyfork.org/scripts/36594/%E6%BC%A2%E5%85%8B%E8%B5%B7%E5%BA%8A%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/36594/%E6%BC%A2%E5%85%8B%E8%B5%B7%E5%BA%8A%21%21%21.meta.js
// ==/UserScript==

var message, date0 = new Date ('12/21/2017'), date1 = new Date(),count,json,obj,currenthour,currentmin,time;

var papago = "https://discordapp.com/api/webhooks/393550264784781312/4klXHGqHkM7dKMQm1PwtlJfrWQ3EoIXhG8XEFmOmv3kVDfkMxQCFF9CZdfH1IoOVRcOn";
var papago89 = "https://discordapp.com/api/webhooks/393549174613737473/NPoQjZERkoD6hnO2CCpWmu91OgDgBcxtNttZ_ago2STSQ5_ycvhx0pBQUWAOrfE4Qh2Y";

function sleep(milliseconds)
{
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++)
  {
    if ((new Date().getTime() - start) > milliseconds)
    {
      break;
    }
  }
}

function pushMessageToDiscord(jsonString, targetUrl)
{
    var request = new XMLHttpRequest(); // xhr() 會建立非同步物件
    request.open("POST", papago, false); // 同步連線 POST到該連線位址
    request.setRequestHeader('Content-Type', 'application/json');
    console.log(jsonString);
    request.send(jsonString);
}

function repeat()
{
    pushMessageToDiscord(json, papago);
}


function datecount ()
{
    count = ((date1 - date0)/(1000 * 60 * 60 * 24));
    count = Math.floor(count);
    message = "<@271269885307387904>說推薦票會返投的第" + count + "天";
    obj =
    {
        content : message
    };
    json = JSON.stringify(obj);
    pushMessageToDiscord(json, papago);
}

function timecall()
{
    time = new Date();
    currenthour = time.getHours();
    currentmin = time.getMinutes();

//0:00

    if (currenthour==0||currenthour==1||currenthour==2||currenthour==3)
    {


    if (currentmin===0)
        {
            message = "<@271269885307387904>投完推薦票快去睡啦!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
        
    }

//7:00

    if (currenthour==7)
    {


    if (currentmin===0)
        {
            message = "<@271269885307387904>起床投推薦票囉!!!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
//7:30
	else if (currentmin===30)
        {
            message = "<@271269885307387904>一定要吃早餐喔!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
        
    }

//8:00

    else if(currenthour==8)
    {
        if (currentmin==0)
        {
            message = "<@271269885307387904>早八上課!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
    }  

//12:00

    else if(currenthour==12)
    {
        if (currentmin==0)
        {
            message = "<@271269885307387904>中午開飯!!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
    }

//13:10

    else if (currenthour==13)
    {
        if (currentmin===10)
        {
            message = "<@271269885307387904>下午繼續上課!!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
    }

//15:15

    else if (currenthour==15)
    {
        if (currentmin==15)
        {
            message = "<@271269885307387904>it is tea time!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
       
    }

//17:00

    else if (currenthour==17)
    {
        if (currentmin==00)
        {
            message = "<@271269885307387904>該回家投推薦票囉!!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
       
    }

//18:30
    
    else if (currenthour==18)
    {
        if (currentmin==30)
        {
            message = "<@271269885307387904>快去吃晚餐!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
    }

//20:00

    else if (currenthour==20)
    {
        if (currentmin==00)
        {
            message = "<@271269885307387904>快去洗澡澡!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }

//20:30

	else if (currentmin==30)
        {
            message = "<@271269885307387904>洗澡完，快去投推薦票!!!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
    }

//22:00

    else if (currenthour==20)
    {
        if (currentmin==00)
        {
            message = "<@271269885307387904>別再玩黑沙了!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }

	else if (currentmin==40)
        {
            message = "<@271269885307387904>睡前記得投推薦票喔!!!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
    }

//23:00

    else if (currenthour==23)
    {
        if (currentmin==00)
        {
            message = "<@271269885307387904>該上床睡覺了喔!";
            var obj =
            {
                content : message
            };
            json = JSON.stringify(obj);
            pushMessageToDiscord(json, papago89);
        }
    }

}
function three()
{
    var time;
    time = new Date();
    currenthour = time.getHours();
    currentmin = time.getMinutes();
    if ((currenthour==6)||(currenthour==12)||(currenthour==18)||(currenthour===0))
    {
        if (currentmin===0)
        {
            datecount();
        }
    }
}
function once(fn, context)
{
    var result;

    return function()
    {
        if(fn)
        {
            result = fn.apply(context || this, arguments);
            fn = null;
        }

        return result;
    };
}

(function()
{
    'use strict';
    setInterval(timecall, 60000);
    once(datecount());
    setInterval(three, 60000);

})();