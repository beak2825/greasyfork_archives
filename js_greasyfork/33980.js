// ==UserScript==
// @name        del_quotes
// @namespace   1
// @include     http://www.eador.com/B2/posting.php?mode=quote*
// @include     http://eador.com/B2/posting.php?mode=quote*
// @version     1.01
// @grant       none
// @description Delete quotes in quotes
// @downloadURL https://update.greasyfork.org/scripts/33980/del_quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/33980/del_quotes.meta.js
// ==/UserScript==

var msg = document.getElementsByName("message")[0].innerHTML;
var qtsX = [];
var qtsY = [];

var pos1 = 0;
while(true)
{
  var pos = msg.indexOf("[/quote]", pos1);
  if (pos == -1)
      break;
  qtsY.push(pos);
  pos1 = pos + 8;
}

while (qtsY.length > 2)
{
    pos1 = 0;
    while (true)
    {
        var pos = msg.indexOf("[quote", pos1);
        if (pos == -1)
            break;
        qtsX.push(pos);
        pos1 = pos + 6;
    }
    
    if (qtsX.length != qtsY.length)
        break;
    
    var len = qtsX.length;
    if (qtsX[len - 1] < qtsY[0]) // äëÿ îäèíî÷íûõ öèòàò
    {
       msg = msg.slice(0,qtsX[2]) + msg.slice(qtsY[qtsY.length - 3] + 8);
       document.getElementsByName("message")[0].innerHTML = msg;
       break;
    }
    
    if (len < 4)
        break;
    
    var qtsMap = [];
    var x = 0;
    var y = 0;
    var z = 1;
    for (var i = 0; i < len+len; i++)
    {
        if (qtsX[x] < qtsY[y])
        {
            qtsMap[i] = [];
            qtsMap[i][0] = z++;
            qtsMap[i][1] = qtsX[x];
            x++;
        }
        else
        {
            qtsMap[i] = [];
            qtsMap[i][0] = --z;
            qtsMap[i][1] = qtsY[y];
            y++;
        }

    }
    
    var map2 = [];
    z = 0;
    len = qtsMap.length;
    for (var i = 2; i < len; i++)
    {
        if (qtsMap[i][0] === 3)
        {
            map2[z] = qtsMap[i][1];
            z++;
            for (i++; i < len; i++)
            {
                if (qtsMap[i][0] === 3)
                {
                    map2[z] = qtsMap[i][1];
                    z++;
                }
            }
        }
    }
    
    if (z == 0)
        break;
    
    len = map2.length;
    msg = msg.slice(0, map2[len-2]) + msg.slice(map2[len-1] + 8);
    for (var i = z-3; i > 0; i--)
    {
        msg = msg.slice(0, map2[i-1]) + msg.slice(map2[i] + 8);
        i--;
    }
    
    document.getElementsByName("message")[0].innerHTML = msg;
    break;
}