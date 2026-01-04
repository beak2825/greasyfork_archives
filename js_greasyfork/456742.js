// ==UserScript==
// @name         BlsEyesNewBookContinue
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  MeGaBlsMasterkiller2
// @author       MeGaBOuSsOl
// @match        https://algeria.blsspainvisa.com/book_appointment.php
// @match        https://mail.google.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @include      https://algeria.blsspainvisa.com/book_appointment.php
// @include      https://mail.google.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       God
// @downloadURL https://update.greasyfork.org/scripts/456742/BlsEyesNewBookContinue.user.js
// @updateURL https://update.greasyfork.org/scripts/456742/BlsEyesNewBookContinue.meta.js
// ==/UserScript==

/*Emails Psswd and MailNumber*/
var Email_1= "wahranazicouriel0@gmail.com";
var Gmail_1="0";
var Email_2= "wahranicourssiel1@gmail.com";
var Gmail_2="1";
var Email_3= "wahranicqqouriel2@gmail.com";
var Gmail_3="2";
var Email_4= "wahranicouwwriel3@gmail.com";
var Gmail_4="3";
var Email_5= "wahranicouwriel4@gmail.com";
var Gmail_5="4";
var Email_6= "wahraniwwcouriel5@gmail.com";
var Gmail_6="5";
var Email_7= "wahraniqcouriel6@gmail.com";
var Gmail_7="6";
var Email_8= "wahrqqanicouriel7@gmail.com";
var Gmail_8="7";
var Email_9= "wahransssicouriel8@gmail.com";
var Gmail_9="8";
/*Constants*/
var Body= document.body;
var outerText = document.body.outerText;
var innerHTML = document.body.innerHTML;
var loc = window.location.href;
var Gmail = loc.indexOf('https://mail.google.com/');
var book_appointment = loc.indexOf('book_appointment.php');
var appointment = loc.indexOf('/appointment.php');
/*SendOtpeWHenOtpWhenNotSentToYourPhone*/
/*book_appointment*/
if(book_appointment!== -1){};
var SendOtopWHenOtpsasasa = setInterval(function() {

			if (((document.getElementById("reponse_div").innerText).indexOf("sent to you")) == -1) {
				setTimeout(function() {
					document.querySelector("#em_tr > div.col-sm-6 > abbr > input").click();
				}, (21 / 17) * 200);
				clearInterval(SendOtopWHenOtpsasasa);
			}else{
            /*When Otp Sent To Your phone*/

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
                            localStorage.setItem('Gmail2', 'opened');console.log('A box Mail is opened succufully');
                        }, 1700);

				clearInterval(SendOtopWHenOtpsasasa);
            }

	},
	4000);



/*Gmail*/
if(Gmail!== -1){
//Not prepared yet
};




/*appointment*/
if(appointment!== -1){
//Not prepared yet
};





