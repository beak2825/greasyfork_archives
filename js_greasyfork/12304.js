// ==UserScript==
// @name         JwinfoAutomationLogin
// @namespace    https://github.com/6769/m14kabing
// @version      1.0.1
// @description  Automaticly complete Verification code in ZJU jwinfobsys .
// @author       5pipi
// @match        http://10.202.78.11/default2.aspx
// @match        http://jwbinfosys.zju.edu.cn/default2.aspx
// @grant        none
// @license      GPL version 3
// @encoding     utf-8
// @usage		 In StudentID,change a dozen zeros to your id,and the password.The service site ,I provide an available one use Niginx+uWSGI+Flask on linux.
// @downloadURL https://update.greasyfork.org/scripts/12304/JwinfoAutomationLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/12304/JwinfoAutomationLogin.meta.js
// ==/UserScript==
'use strict';
var StudentID="0000000000";//Your StudentsID;

var PassworD="";//Your password of the site,if you don't like to fill here,keep[ "" ];


var StudentBox="TextBox1";
var PassworDBox="TextBox2";
var VerifyCodeBox="Textbox3";
var ErrorCode="0";
var RegularExpress="\\d{5}";

var Debug=0;//1 === Debug;	0 === Release;
var StringOfImage;
var Host="http://api.5pipi.tk/api/zjuocr";


//environment initialized;
function DebugSwitch(booleanvalue){
    if(!booleanvalue){
        console.log=function(){
            //pass
        };
    }
}
function inputVerifyCode (jsonobject_str) {
	var number ;

	number= eval("("+jsonobject_str+")")['verify']


	//optional choice.
	number.replace(/B/g,'8');
	//try to fix OCR's limited point when using in reality.Api return "verify": "70B41" .
    var number_confirm=new RegExp(RegularExpress);
    var number_int;
    if (number.length===5 && typeof(number)==='string') 
        if(number=number.match(number_confirm)){
            //regular express;
            number_int=parseInt(number);
            document.getElementById(VerifyCodeBox).value=number;
        }
    else{
        document.getElementById(VerifyCodeBox).value=ErrorCode;
    }
    else{
        document.getElementById(VerifyCodeBox).value=ErrorCode;
    }






}

//use VerifyCodeImage;
function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    // canvas.width = img.width-5;//60*22,actually 65*24
    // canvas.height = img.height-2;
    canvas.width =img.naturalWidth;
    canvas.height =img.naturalHeight;
    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    //another problem will happened if img hasn't loaded over.->get broken picture.

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");


    //debugtest
    console.log(dataURL);
    //window.open(dataURL);

    //Bug_0
    //during most periods,Base64code presents well ,Howerver,B64String length become very short,
    //It's happens 5/20;
    var pure_b64string=dataURL.replace("data:image/png;base64,",'');
    var urlsafe_pure_b64string=pure_b64string.replace(/\+/g,'-');
    return urlsafe_pure_b64string.replace(/\//g ,'_');
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            console.log(xmlHttp.responseText);
            callback(xmlHttp.responseText);}
    }
    console.log(theUrl);
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}



function maintask ( ) {
    var b64string;
    var img;
    DebugSwitch(Debug);

    //convertImage->string
    img=document.getElementsByTagName('img')[0];
    
    img.onload = function() {
    // when image is loaded...
    console.log(getBase64Image(img));
    b64string=getBase64Image(img);
    //
    StringOfImage=Host+"?img="+b64string;


    httpGetAsync(StringOfImage,inputVerifyCode);

    document.getElementById(StudentBox).value=StudentID;
    document.getElementById(PassworDBox).value=PassworD;
	};

}

maintask();

/*Thanks to 
http://stackoverflow.com/questions/934012/get-image-data-in-javascript
http://stackoverflow.com/questions/23493147/error-when-converting-image-to-base64

*/
