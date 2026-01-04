// ==UserScript==
// @name        Image Maximiser
// @namespace   PolllyPecker
// @include     https://scontent-syd2-1.cdninstagram.com/*
// @include     http://image.vsco.co/*
// @include     http://mjmm.co.uk/wp-content/*
// @include     http://vsco.co/*
// @include     https://vsco.co/*
// @include     *image-aws-us-west*
// @version     2.1
// @description Maxamises images
// @grant       GM_openInTab
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       window.close
// @downloadURL https://update.greasyfork.org/scripts/34915/Image%20Maximiser.user.js
// @updateURL https://update.greasyfork.org/scripts/34915/Image%20Maximiser.meta.js
// ==/UserScript==

//Instagram vars
var instastring = "scontent-syd2-1.cdninstagram";
var vscostring = "image.vsco.co";
var vscostring2 = "vsco.co";
var mjmm = "mjmm.co.uk";

//Main vars
var window_close_on_focus = false;
var searchableStr = document.URL;
var sizepattern = /-\d+x\d+/;
var newURL = "";
var lock = true;
var ready = 1;

document.addEventListener('keydown', pressIt, false);
window.addEventListener("focus", windowFocus, false);

var is_vscoRawImg = searchableStr.includes("image-aws-us-west");

function vscoGoImg()
{
    //var imgcontainer = document.getElementsByClassName("Image Image--loaded disableSave-mobile");
	var date_stamp = vsco_getImageDate();
	var new_URL_redirect = "";

    var imgcontainer = document.getElementsByClassName("disableSave-mobile");
    if (sizepattern.test(imgcontainer[0].src))
    {
		  new_URL_redirect = imgcontainer[0].src.replace(sizepattern, "");
    }
    else
    {
        var s = imgcontainer[0].src;
        var n = s.indexOf('?');
        s = s.substring(0, n != -1 ? n : s.length);
		new_URL_redirect = s;
    }
	
	console.log(new_URL_redirect + "?ds=" + date_stamp);
	
	/*
	var new_link = document.createElement("a");
	new_link.href = new_URL_redirect;
	new_link.download = date_stamp + "   lalala";
	new_link.id = "yoyoyo";
	document.body.appendChild(new_link);
	new_link.click();
	*/
	
	//GM_openInTab(new_URL_redirect + "?ds=" + date_stamp);
	
	
	GM.setValue(getVSCO_storeStr(new_URL_redirect), date_stamp);
	
	window.location.href = new_URL_redirect + "?ds=" + date_stamp;
	
    //return 0;
}

if (ready == 1)
{
  if (searchableStr.includes(instastring) && !searchableStr.includes("mp4"))
  {
      var arrayOfStrings = searchableStr.split("/");
      for (i = 0; i < arrayOfStrings.length; i++)
      {
          arrayOfStrings[i] = arrayOfStrings[i] +"/";
          if (arrayOfStrings[i].includes("480x480") || arrayOfStrings[i].includes("750x750") || arrayOfStrings[i].includes("640x640"))
          {
              arrayOfStrings[i] = "";
              lock = false;
          }
          newURL = newURL + arrayOfStrings[i];
      }

      if (lock === false)
      {
         newURL = newURL.slice(0, -1);
         window.location.href = newURL;
      }
      else
      {
          ready = 0;
      }
  }
  else if (searchableStr.includes(vscostring2) && searchableStr.includes("/media/"))
  {
    window.onload = vscoGoImg;
  }
  else if (searchableStr.includes(mjmm))
  {
      if (searchableStr.search(sizepattern) > -1)
      {
          var newURL = searchableStr.replace(sizepattern, "");
          window.location.href = newURL;
      }
  }
  else if (is_vscoRawImg)
  {
	  console.log(searchableStr);
	  getDatestamp();
  }
}


function pressIt(event)
{
    event = event || window.event;
	if (is_vscoRawImg)
	{
		if (clickCheck("nav-execute", event.keyCode)) document.getElementById("iamtheoneyouwant").click();
        else if (clickCheck("nav-quit", event.keyCode)) window.close();
	}
}


///// SPECIFIC MISC FUNCTIONS
function vsco_getImageDate()
{
	var date_string = document.getElementsByClassName("mr8")[0].innerHTML;
	var dt_month = "00";
	var str_mnt = [];
	str_mnt[0] = "January ";
	str_mnt[1] = "February ";
	str_mnt[2] = "March ";
	str_mnt[3] = "April ";
	str_mnt[4] = "May ";
	str_mnt[5] = "June ";
	str_mnt[6] = "July ";
	str_mnt[7] = "August ";
	str_mnt[8] = "September ";
	str_mnt[9] = "October ";
	str_mnt[10] = "November ";
	str_mnt[11] = "December ";

	for (var i=0; i<12; i++)
	{
		if (date_string.includes(str_mnt[i]))
		{
			var date_stamp = i+1;
			if (date_stamp < 10) date_stamp = "0" + String(date_stamp);
			dt_month = String (date_stamp);
			date_string = date_string.replace(str_mnt[i], "");
			break;
		}
	}
	var other_parts = date_string.split(", ");
	var date_stamp_out = other_parts[1] + "-" + dt_month + "-" + other_parts[0];
	return date_stamp_out;
}
function getVSCO_storeStr(url_str)
{
	url_str = url_str.substring(8,url_str.length);
	var pang_out = url_str.split("/");
	var new_str = pang_out[pang_out.length-1].replace(".jpg", "");
	console.log(new_str);
	return new_str;
}
async function getDatestamp() {
	var clean_jpgName = getVSCO_storeStr(document.URL);
    let result = await GM.getValue(clean_jpgName);

	// Setup Download Button
	var main_img = document.getElementsByTagName("img")[0];
	var new_a = document.createElement("a");
	new_a.href = main_img.src;
	new_a.id = "iamtheoneyouwant";
	new_a.style.position = "absolute";
	new_a.style.width = "200px";
	new_a.style.height = "50px";
	new_a.style.left = "0";
	new_a.style.top = "0";
	new_a.style.backgroundColor = "#7b253f";
	new_a.style.color = "black";
	new_a.style.textAlign = "center";
	new_a.innerHTML = "Download";
	
	new_a.download = result + "   " + clean_jpgName + ".jpg";
	main_img.parentNode.appendChild(new_a);
	new_a.addEventListener("click", function newfunction() {window_close_on_focus = true;});
}

// UNIVERSAL FUNCTIONS
function windowFocus()
{
    if (window_close_on_focus) window.close();
}
function clickCheck(type, keycode)
{
    if (type == "nav-left") // [[] or [V]
    {
        if (keycode=='219' || keycode=='186') return true;
    }
    else if (type == "nav-right") // []] or [X]
    {
        if (keycode=='221' || keycode=='222') return true;
    }
    else if (type == "nav-execute") // [C] or ['] (next to enter key) or [Enter] or [\]
    {
        if (keycode=='67' || keycode=='222' || keycode=='13' || keycode=='220') return true;
    }
    else if (type == "nav-quit") // [ESC] or [;] or [p]
    {
        if (keycode=='27' || keycode=='186' || keycode=='80') return true;
    }
	else if (type == "nav-bigleft") // [-] or [-](num)
	{
		if (keycode=='189' || keycode=='109') return true;
	}
	else if (type == "nav-bigright") // [+] or [+](num)
	{
		if (keycode=='187' || keycode=='107') return true;
	}
	else if (type == "nav-ss") // [S] or [L]
	{
		if (keycode=='83' || keycode=='76') return true;
	}
    return false;
}