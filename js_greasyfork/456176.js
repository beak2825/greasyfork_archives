// ==UserScript==
// @name         BlsEyesNew
// @namespace    http://tampermonkey.net/
// @version      7.7
// @description  MeGaBlsMasterkiller
// @author       MeGaBOuSsOl
// @match        https://algeria.blsspainvisa.com/reprint_appointment_letter.php*
// @match        https://mail.google.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @include      https://algeria.blsspainvisa.com/*
// @include      https://mail.google.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       God
// @downloadURL https://update.greasyfork.org/scripts/456176/BlsEyesNew.user.js
// @updateURL https://update.greasyfork.org/scripts/456176/BlsEyesNew.meta.js
// ==/UserScript==

/*Variables*/
var TimeIndex= 7;
var TimeLogin1= 11 ; TimeLogin1=TimeLogin1 *1000;
var TimeLogin2= 11 ;
var TimeOpenEmail= 13 ;
var TimeBookExit= 85 ;
var TimeWhiteAppointmentExit= 7 ;
var TimeReload1stCheckBox= 11;

/*Emails Psswd and MailNumber*/
var Email_1= "wahraddenicouriel0@gmail.com";
var Pswd_1= "#?rJuajD";
var Gmail_1="0";
var Email_2= "wahraaazsznicouriel1@gmail.com";
var Pswd_2= "BFkFw7WK";
var Gmail_2="1";
var Email_3= "wahrasazszanicouriel2@gmail.com";
var Pswd_3= "DpYOL2DV";
var Gmail_3="2";
var Email_4= "wahrasszanicouriel3@gmail.com";
var Pswd_4= "@r?V!lkP";
var Gmail_4="3";
var Email_5= "wahranaaaicouriel4@gmail.com";
var Pswd_5= "teYo0TRw";
var Gmail_5="4";
var Email_6= "wahransasasicouriel5@gmail.com";
var Pswd_6= "?nS3sR16";
var Gmail_6="5";
var Email_7= "wahranicoursasasiel6@gmail.com";
var Pswd_7= "EbOwSHzd";
var Gmail_7="6";
var Email_8= "wahranicouriel7@sasasgmail.com";
var Pswd_8= "Dxv2ANek";
var Gmail_8="7";
var Email_9= "wahrsasasanicouriel8@gmail.com";
var Pswd_9= "AjcYE&aq";
var Gmail_9="8";
/*Constants*/
var Body= document.body;
var outerText = document.body.outerText;
var innerHTML = document.body.innerHTML;
var loc = window.location.href;
var Gmail = loc.indexOf('https://mail.google.com/');
var index = loc.indexOf('index.php');
var login = loc.indexOf('login.php');
var book_appointment = loc.indexOf('book_appointment.php');
var appointment = loc.indexOf('/appointment.php');
var login1 = outerText.indexOf("your email and password");
var login2 = outerText.indexOf("We've sent an OTP");
var loginMissed = outerText.indexOf("already sent OTP");
/*Declarations*/



/*******************************************************************Index*******************************************************************/
if (index !== -1) {
/*indexTo login*/
document.querySelector("#IDBodyPanel > div.popupCloseIcon").click();
setTimeout(function(){document.querySelector("body > div.row.bodypanel > article > div > div.container.stepBox > a:nth-child(2) > h4").click()},TimeIndex*1000);
};
/*******************************************************************Login1*******************************************************************/
    if (login !== -1 && login1!== -1) {

                /*Delete storage otp1 In index*/
                //clearAllStore();
                var emailInput = document.querySelector("#al_login > div.col-sm-8.container.paddingInBoxExtra.roundCornerExtra > div:nth-child(1) > div:nth-child(2) > input");
                var emailButtonClick = document.querySelector("#al_login > div.col-sm-8.container.paddingInBoxExtra.roundCornerExtra > div:nth-child(2) > input.row.btn.primary-btn.pull-right.marginBottomNone");
                var warningMessageLogin1 = document.querySelector("body > div.row.innerbodypanel > section > div > div > div > div > div > div > p");




                if (warningMessageLogin1 == null) {
                    emailInput.value=localStorage.getItem('ActualEmail');
                    setTimeout(function() {
                        emailButtonClick.click();

                    }, (16 * 1000))
                } else {
                    /*Choose Email*/
                    console.log('Choosing email...');
                if(localStorage.getItem('ActualEmail')==null){emailInput.value = Email_1;console.log('Email choosen is : '+Email_1);;localStorage.setItem('ActualEmail',Email_1 );}else{
                    if(localStorage.getItem('ActualEmail')==Email_1){emailInput.value=Email_2;console.log('First Email choosen is : '+Email_2);localStorage.setItem('ActualEmail',Email_2 );}else{
                    if(localStorage.getItem('ActualEmail')==Email_2){emailInput.value=Email_3;console.log('Second Email choosen is : '+Email_3);localStorage.setItem('ActualEmail',Email_3 );}else{
                    if(localStorage.getItem('ActualEmail')==Email_3){emailInput.value=Email_4;console.log(' Third Email choosen is : '+Email_4);localStorage.setItem('ActualEmail',Email_4 );}else{
                    if(localStorage.getItem('ActualEmail')==Email_4){emailInput.value=Email_5;console.log('Forth Email choosen is : '+Email_5);localStorage.setItem('ActualEmail',Email_5 );}else{
                    if(localStorage.getItem('ActualEmail')==Email_5){emailInput.value=Email_6;console.log('fifth Email choosen is : '+Email_6);localStorage.setItem('ActualEmail',Email_6 );}else{
                    if(localStorage.getItem('ActualEmail')==Email_6){emailInput.value=Email_7;console.log('Sixth Email choosen is : '+Email_7);localStorage.setItem('ActualEmail',Email_7 );}else{
                    if(localStorage.getItem('ActualEmail')==Email_7){emailInput.value=Email_8;console.log('Senventh Email choosen is : '+Email_8);localStorage.setItem('ActualEmail',Email_8 );}else{
                    if(localStorage.getItem('ActualEmail')==Email_8){emailInput.value=Email_9;console.log('Eighth Email choosen is : '+Email_9);localStorage.setItem('ActualEmail',Email_9 );}else{
                    if(localStorage.getItem('ActualEmail')==Email_9){emailInput.value=Email_1;console.log('Nineth Email choosen is : '+Email_1);localStorage.setItem('ActualEmail',Email_1 );}else{
                        localStorage.removeItem('ActualEmail');console.log('ActualEmail initialised');
                }
                }
                }
                }
                }
                }
                }
                }
                }
                };console.log('Loging after '+TimeLogin1 +'...');
                    setTimeout(function() {
                        emailButtonClick.click()
                    }, (TimeLogin1))

                };
    };
/*******************************************************************Login2*******************************************************************/
        if (login !== -1 && login2 !==-1) {console.log('Login2 Setting:');
            if (localStorage.getItem('otp1') !== null) { localStorage.removeItem('otp1');GM_deleteValue('otp1');console.log('delete a storage otp1');}
            /*Constants*/
             var LoginButton = document.querySelector("#al_login > div > div:nth-child(3) > input.row.btn.primary-btn.pull-right.marginBottomNone");
                    var warningMsgLogin2 = document.querySelector("body > div.row.innerbodypanel > section > div > div > div > div > div > div > p");
                    var WrongLog = 'Please enter correct OTP/Password.\n';
                    var OtpPlace = document.querySelector("#al_login > div > div:nth-child(1) > div:nth-child(2) > input");
             /*Open Gmail if 1stOtp sent*/
                    if (localStorage.getItem('Gmail') == null) {
                        console.log("Start looking for otp1");
                         if(localStorage.getItem('ActualEmail')==Email_1){ window.open("https://mail.google.com/mail/u/"+Gmail_1+"/#inbox", "_blank");;}else{
                    if(localStorage.getItem('ActualEmail')==Email_2){ window.open("https://mail.google.com/mail/u/"+Gmail_2+"/#inbox", "_blank");}else{
                    if(localStorage.getItem('ActualEmail')==Email_3){ window.open("https://mail.google.com/mail/u/"+Gmail_3+"/#inbox", "_blank");}else{
                    if(localStorage.getItem('ActualEmail')==Email_4){ window.open("https://mail.google.com/mail/u/"+Gmail_4+"/#inbox", "_blank");}else{
                    if(localStorage.getItem('ActualEmail')==Email_5){ window.open("https://mail.google.com/mail/u/"+Gmail_5+"/#inbox", "_blank");}else{
                    if(localStorage.getItem('ActualEmail')==Email_6){ window.open("https://mail.google.com/mail/u/"+Gmail_6+"/#inbox", "_blank");}else{
                    if(localStorage.getItem('ActualEmail')==Email_7){ window.open("https://mail.google.com/mail/u/"+Gmail_7+"/#inbox", "_blank");}else{
                    if(localStorage.getItem('ActualEmail')==Email_8){ window.open("https://mail.google.com/mail/u/"+Gmail_8+"/#inbox", "_blank");}else{
                    if(localStorage.getItem('ActualEmail')==Email_9){ window.open("https://mail.google.com/mail/u/"+Gmail_9+"/#inbox", "_blank");}
                }
                }
                }
                }
                }
                }
                }
                };


                        setTimeout(function() {
                            localStorage.setItem('Gmail', 'opened');console.log('A bob Mail is opened succufully');
                        }, 1700);
                    };
            /*Put password*/
            var passwordClient=document.querySelector("#al_login > div > div:nth-child(2) > div:nth-child(2) > input");
                    if(localStorage.getItem('ActualEmail')==Email_1){passwordClient.value = Pswd_1;}else{
                    if(localStorage.getItem('ActualEmail')==Email_2){passwordClient.value=Pswd_2}else{
                    if(localStorage.getItem('ActualEmail')==Email_3){passwordClient.value=Pswd_3}else{
                    if(localStorage.getItem('ActualEmail')==Email_4){passwordClient.value=Pswd_4}else{
                    if(localStorage.getItem('ActualEmail')==Email_5){passwordClient.value=Pswd_5}else{
                    if(localStorage.getItem('ActualEmail')==Email_6){passwordClient.value=Pswd_6}else{
                    if(localStorage.getItem('ActualEmail')==Email_7){passwordClient.value=Pswd_7}else{
                    if(localStorage.getItem('ActualEmail')==Email_8){passwordClient.value=Pswd_8}else{
                    if(localStorage.getItem('ActualEmail')==Email_9){passwordClient.value=Pswd_9}
                }
                }
                }
                }
                }
                }
                }
                };
            /*Insert Otp*/
          var waiterForOtp= setInterval(function(){
           if (GM_getValue("otp1") !== null && GM_getValue("otp1") !== undefined) {
                        console.log("Gm_value founded \n Transfering it...");
                        localStorage.setItem('otp1', (GM_getValue("otp1")));
                        console.log('MeGaStorage Transfered Successfuly value is '+GM_getValue("otp1"));
                        OtpPlace.value=localStorage.getItem('otp1');
                        /*Chek id otp1 is a number*/
                        if (isNaN(localStorage.getItem('otp1')) == true) {
                            console.log('otp is not a number\nRepration loading...');
                            localStorage.removeItem('Gmail');localStorage.removeItem('otp1');
                        };
               clearInterval(waiterForOtp);
                    };
          },1000);console.log('Login in'+TimeLogin2+'...');
                    setTimeout(function() {//localStorage.removeItem('Gmail');
                        LoginButton.click();
                    }, TimeLogin2 * 1000);
        };
/*******************************************************************Gmail*******************************************************************/
            if (Gmail !== -1) {console.log('Box Mail Setting:');
                if(localStorage.getItem('GmailStatut')!== null ){
                 if (localStorage.getItem('otp1') !== null) {console.log('Initialisation of storage...'); localStorage.removeItem('otp1');GM_deleteValue('otp1');}
/*ReaderOtp In gmail*/
                        /*Open the last email*/
                    console.log('Reading OTP Started ');
setTimeout(function(){
                    var outerHTML = document.body.outerHTML;
var targetFix = "SYSTEM GENERATED VERI";
var target4 = outerHTML.lastIndexOf(targetFix);
var begin = target4 -50 /*begin classeName aproximatif ---*/
var end = target4 - 25; /*end classeName approximatif +++*/

var cibleImage = outerHTML.substring(begin, end);

var appo = cibleImage.lastIndexOf('"');
if (appo !== -1) {
    var DecaleLeft = cibleImage.length - appo;
    var newCibleImage = outerHTML.substring(begin, end - DecaleLeft);
    var appoNCI = newCibleImage.indexOf('"');
    if (appoNCI !== -1) {
        var cutBeginToAppo = appoNCI + 1;
        var classImg = outerHTML.substring(begin + cutBeginToAppo, end - DecaleLeft);

    } else {
         classImg = newCibleImage;
    }
} else {
     classImg = cibleImage;
}

console.log(classImg);
    document.getElementsByClassName(classImg)[0].click()
},(TimeOpenEmail-2)*1000);
                var OtpReaderOtp = setTimeout(function() {
                    var NewinnerHTML = document.body.innerHTML;
                    var target = NewinnerHTML.indexOf('use-credentials');
                    var target2 = NewinnerHTML.indexOf('Please verify your email by below OTP');


                    setTimeout(function() {
                        if (localStorage.getItem('otp1') !== null) { console.log("Otp exist pleez check")} else {
                            var NeWinnerHTML = document.body.innerHTML;
                            console.log('otp1 dosn t exist');
                            if (NeWinnerHTML.substring(target2 + 49, target2 + 52) == '"') {
                                var textOtp1 = NeWinnerHTML.substring(target2 + 45, target2 + 51);
                                localStorage.setItem('otp1', textOtp1);
                                GM_setValue('otp1', localStorage.getItem('otp1'));

                            } else {
                                var textOtp = NeWinnerHTML.substring(target2 + 45, target2 + 52);
                                localStorage.setItem('otp1', textOtp);
                                GM_setValue('otp1', localStorage.getItem('otp1'));

                                console.log('otp1 value is ' + textOtp);
                                /*Chek id otp1 is a number*/
                                if (isNaN(localStorage.getItem('otp1')) == null) {
                                    console.log('otp is not a number\nRepration loading...');
                                    OtpReaderOtp();
                                };
                            }
                        };
                        console.log('otp1 text found, value is ' + textOtp);
                        console.log('Closing Gmail...');
                        setTimeout(function() {
                          localStorage.removeItem('GmailStatut');
                            window.close();
                        }, 3000);

                    }, 1000);
                    /*clearInterval(OtpReaderOtp);*/
                }, TimeOpenEmail * 1000);

                }else{console.log('first Conection in Box Mail. pleez wait for reloading');localStorage.setItem('GmailStatut', 'FrirstCheck'); setTimeout(function(){window.location.reload();},TimeReload1stCheckBox*1000)};
               };
/*******************************************************************book_appointment*******************************************************************/
                if (book_appointment !== -1) {console.log('Book_appointment Setting:');
                                              console.log('Storage clearing...');
localStorage.removeItem('otp1');
localStorage.removeItem('Gmail');
GM_deleteValue('otp1');
                    if(outerText==""){
                        console.log('APPOINTMENT ARE NOT AVAILABLE\n White page');
                        setTimeout(function() {window.location.href= 'https://algeria.blsspainvisa.com/index.php'},TimeBookExit*1000);}else{new Audio('https://www.myinstants.com/media/sounds/cut_y2mate_Ooa5JNV.mp3').play();}
                };
/*******************************************************************appointment*******************************************************************/
                if (appointment !== -1) {
if(outerText==""){console.log('Appointment white page\nReparation in');setTimeout(function() {window.location.href= 'https://algeria.blsspainvisa.com/index.php'},TimeWhiteAppointmentExit*1000);}
                }