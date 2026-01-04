// ==UserScript==
// @name        Discombobulate
// @description Allows you to control two tanks at once, Hours of suffering was endured for this, but in summary discombobulate.
// @version     1.0
// @author      CollierDevs
// @include     https://diep.io/*
// @connect     diep.io
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @namespace https://diep.io/*
// @downloadURL https://update.greasyfork.org/scripts/400146/Discombobulate.user.js
// @updateURL https://update.greasyfork.org/scripts/400146/Discombobulate.meta.js
// ==/UserScript==

var isFocused = 0;
var holdingKey = {};
var holdingMouse = {};
var screenWidth = 0;
var screenHeight = 0;

var const_SC = getScreenConstant();

    document.addEventListener('keyup', function(e)
    {
		var key = e.keyCode || e.which;
        if(e.shiftKey)
        {
            return;
        }
        GM_setValue("GM_Diep_Key"+key, 0);
        holdingKey[key] = false;
	});

	document.addEventListener('keydown', function(e)
	{
		var key = e.keyCode || e.which;
        if(e.shiftKey)
        {
            return;
        }
		if(holdingKey[key]) { e.stopPropagation(); return; }
        GM_setValue("GM_Diep_Key"+key, 1);
        holdingKey[key] = true;
	});

    document.addEventListener('mousedown', function(e)
	{
        var button = e.button;
        holdingMouse[button] = true;
        GM_setValue("GM_Diep_Mouse"+button, 1);
        GM_setValue("GM_Diep_Mouse"+button, 1);
	});

    document.addEventListener('mouseup', function(e)
	{
        var button = e.button;
        holdingMouse[button] = false;
        GM_setValue("GM_Diep_Mouse"+button, 0);
        GM_setValue("GM_Diep_Mouse"+button, 0);
	});

    document.addEventListener('mousemove', function(e)
	{
        GM_setValue("GM_Diep_MouseX", e.clientX / window.innerWidth);
        GM_setValue("GM_Diep_MouseY", e.clientY / window.innerHeight);
        GM_setValue("GM_Diep_MouseRelX", e.clientX - (window.innerWidth / 2));
        GM_setValue("GM_Diep_MouseRelY", e.clientY - (window.innerHeight / 2));
	});

    function GetCoordClamp(mouseX, mouseY)
    {
        var ret = {};
        var hsx = window.innerWidth / 2;
        var hsy = window.innerHeight / 2;
        var amx = mouseX - hsx;
        var amy = mouseY - hsy;

        var dc = 0.96;
        if((amx > -hsx * dc) && (amx < hsx * dc) && (amy > -hsy * dc) && (amy < hsy * dc))
        {
            ret[0] = mouseX;
            ret[1] = mouseY;
            return ret;
        }
        else
        {
            var fA = (amx * hsy) - (amy * hsx);
            var fB = (amx * hsy) + (amy * hsx);
            if(fA > 0)
            {
                if(fB > 0)
                {
                    amy = amy * (hsx * dc / amx);
                    amx = hsx * dc;
                }
                else
                {
                    amx = amx * (-hsy * dc / amy);
                    amy = -hsy * dc;
                }
            }
            else
            {
                if(fB > 0)
                {
                    amx = amx * (hsy * dc / amy);
                    amy = hsy * dc;
                }
                else
                {
                    amy = amy * (-hsx * dc / amx);
                    amx = -hsx * dc;
                }
            }
            ret[0] = amx + hsx;
            ret[1] = amy + hsy;
        }
        return ret;
    }

    function SyncMouse()
    {
		var cX = GM_getValue("GM_Diep_MouseX") * window.innerWidth;
        var cY = GM_getValue("GM_Diep_MouseY") * window.innerHeight;
        var dX = GM_getValue("GM_Diep_MouseRelX");
        var dY = GM_getValue("GM_Diep_MouseRelY");
        var button0 = GM_getValue("GM_Diep_Mouse0");
        var button1 = GM_getValue("GM_Diep_Mouse1");
        var button2 = GM_getValue("GM_Diep_Mouse2");

        var clamped = GetCoordClamp(dX + innerWidth / 2, dY + innerHeight / 2);
        if(!(typeof canvas === 'undefined'))
        {
            canvas.dispatchEvent(new MouseEvent('mousemove', { 'clientX': clamped[0], 'clientY': clamped[1] }));
        }
        if(holdingMouse[0] != button0)
        {
            holdingMouse[0] = button0;
            simulateMousePress(0, cX, cY, button0);
        }

        if(holdingMouse[1] != button1)
        {
            holdingMouse[1] = button1;
            simulateMousePress(1, cX, cY, button1);
        }

        if(holdingMouse[2] != button2)
        {
            holdingMouse[2] = button2;
            simulateMousePress(2, cX, cY, button2);
        }
	}

    function SyncKeys()
    {
        var left = GM_getValue("GM_Diep_Key37");
		var up = GM_getValue("GM_Diep_Key38");
		var right = GM_getValue("GM_Diep_Key39");
		var down = GM_getValue("GM_Diep_Key40");

        var num_1 = GM_getValue("GM_Diep_Key49");
        var num_2 = GM_getValue("GM_Diep_Key50");
        var num_3 = GM_getValue("GM_Diep_Key51");
        var num_4 = GM_getValue("GM_Diep_Key52");
        var num_5 = GM_getValue("GM_Diep_Key53");
        var num_6 = GM_getValue("GM_Diep_Key54");
        var num_7 = GM_getValue("GM_Diep_Key55");
        var num_8 = GM_getValue("GM_Diep_Key56");

        for(i = 65; i <= 90; i++)
        {
            var keyCheck = GM_getValue("GM_Diep_Key" + i);
            if(holdingKey[i] != keyCheck)
            {
                holdingKey[i] = keyCheck;
                simulateKeyPress(i, keyCheck);
            }
        }

        var shift = GM_getValue("GM_Diep_Key16");
        var enter = GM_getValue("GM_Diep_Key13");

        if(holdingKey[37] != left)
        {
            holdingKey[37] = left;
            simulateKeyPress(37, left);
        }
        if(holdingKey[38] != up)
        {
            holdingKey[38] = up;
            simulateKeyPress(38, up);
        }
        if(holdingKey[39] != right)
        {
            holdingKey[39] = right;
            simulateKeyPress(39, right);
        }
        if(holdingKey[40] != down)
        {
            holdingKey[40] = down;
            simulateKeyPress(40, down);
        }

        if(holdingKey[49] != num_1)
        {
            holdingKey[49] = num_1;
            simulateKeyPress(49, num_1);
        }
        if(holdingKey[50] != num_2)
        {
            holdingKey[50] = num_2;
            simulateKeyPress(50, num_2);
        }
        if(holdingKey[51] != num_3)
        {
            holdingKey[51] = num_3;
            simulateKeyPress(51, num_3);
        }
        if(holdingKey[52] != num_4)
        {
            holdingKey[52] = num_4;
            simulateKeyPress(52, num_4);
        }
        if(holdingKey[53] != num_5)
        {
            holdingKey[53] = num_5;
            simulateKeyPress(53, num_5);
        }
        if(holdingKey[54] != num_6)
        {
            holdingKey[54] = num_6;
            simulateKeyPress(54, num_6);
        }
        if(holdingKey[55] != num_7)
        {
            holdingKey[55] = num_7;
            simulateKeyPress(55, num_7);
        }
        if(holdingKey[56] != num_8)
        {
            holdingKey[56] = num_8;
            simulateKeyPress(56, num_8);
        }

        if(holdingKey[16] != shift)
        {
            holdingKey[16] = shift;
            simulateKeyPress(16, shift);
        }
        if(holdingKey[13] != enter)
        {
            holdingKey[13] = enter;
            simulateKeyPress(13, enter);
        }
	}

    function simulateKeyPress(key, hold)
    {
		var eventObj;
        if(hold)
        {
            eventObj = document.createEvent("Events"); eventObj.initEvent("keydown", true, true); eventObj.keyCode = key; window.dispatchEvent(eventObj);
        }
		else
        {
		    eventObj = document.createEvent("Events"); eventObj.initEvent("keyup", true, true); eventObj.keyCode = key; window.dispatchEvent(eventObj);
        }
	}

    function simulateMousePress(button, clientX, clientY, press)
    {
		var eventObj;
        if(press)
        {
            if(!(typeof canvas === 'undefined'))
            {
                canvas.dispatchEvent(new MouseEvent('mousedown', { 'clientX': clientX, 'clientY': clientY, 'button': button, 'mozPressure' : 1.0 }));
            }
        }
		else
        {
		    if(!(typeof canvas === 'undefined'))
            {
                canvas.dispatchEvent(new MouseEvent('mouseup', { 'clientX': clientX, 'clientY': clientY, 'button': button, 'mozPressure' : 1.0 }));
            }
        }
	}

    function getScreenConstant()
    {
        if(window.innerWidth > window.innerHeight * 16 / 9)
        {
            return window.innerWidth;
        }
        return window.innerHeight * 16 / 9;
    }

    function calculateScreenConstant(x, y)
    {
        if(x > y * 16 / 9)
        {
            return x;
        }
        return y * 16 / 9;
    }

    function Sync()
    {
        const_SC = getScreenConstant();
        isFocused = document.hasFocus();

        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;

        SyncKeys();
        SyncMouse();
        setTimeout(Sync, 10);
	}
	setTimeout(Sync, 10);