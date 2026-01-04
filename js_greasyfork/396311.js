// ==UserScript==
// @author https://greasyfork.org/en/scripts/30089/versions/new
// @name irctc fill Form
// @namespace irctcbooking
// @grant none
// @include     https://www.irctc.co.in/**
// @description contect me butter knowedge
// @version 4
// @downloadURL https://update.greasyfork.org/scripts/396311/irctc%20fill%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/396311/irctc%20fill%20Form.meta.js
// ==/UserScript==
var stored_value = [];
var clk = new Event("click");
var ipt = new Event("input");
var foc = new Event("focus");
var kup = new Event("keyup");
var blr = new Event("blur");
var kdwn  = new Event("keydown");
var chg = new Event("change");
var cos = new Event("compositionstart");
var coe = new Event("compositionend");
var uid_fill=0;
var pwd_fill=0;
var login_det_fill=0;
var cap_foc=0;
var jrny_filled=0;
var qta_chg=0;
var frm_stn_fill=to_stn_fill=jry_date_fill=0
var psgn_details_filled=0;
var cls_sel=0;
var pymt_mtd_sel=0;
var trn_box="";
var bk_nw_but="";
var bk_nw_sel=0;
var chk_avl_dn=0;
var cnf_tkt=0;
var otp_sel=0;
var data_pre;
var dt_idx="";
var bknw_toast=0;
var otp_toast=0;
var no_trns=0;
var trn_toast=0;
var review_toast=0;
var cls_nt_fnd_toast=0;
var search_suc=0;
var cls_found=0;
var auto_rfrsh_to="";
var cap_err="";
var pay_fwd="0";
var pymt_info="0";
var au_bo=0;
var dta=0;
var udta=0;
var bdta=0;
var aut =0;
var update=0;
var abst;
var la=0;
localStorage.au_bo=0;
 sessionStorage.clr = 1;
setInterval(function () {mainThread();}, 1000);
function mainThread()
{dta=localStorage.fill_Passenger;
  udta=localStorage.fill_Login;
 au_bo=localStorage.au_bo
    if (dta && udta) {
      dta=localStorage.fill_Passenger;
    stor = dta.split('&');
      udta=localStorage.fill_Login;
    stor1 = udta.split('&');
      bdta = localStorage.fill_bank;
      storb = bdta.split('&');
       var d = new Date();
        var tie=d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        document.getElementById('psd').innerHTML ="Passenger Detail.&.Current Time::"+tie;
      altcol=document.querySelectorAll('app-home button')[0]
          if (altcol != null && au_bo == 0){altcol.dispatchEvent(clk);}
      		fillDetails();
			}
 
    	}

function fillDetails()
{
	cur_url=document.location.href;
	bg_ld=document.getElementsByClassName('loading-bg')[0];
	if( bg_ld == null)
	{
      if(cur_url.indexOf('logout') > -1 || cur_url.indexOf('error') > -1 )
		{
      var aout=document.querySelectorAll('app-logout h4 a')[0];
      var aerr=document.querySelectorAll('app-error div a')[0];
      if (aout != null && aut == 0){
        aut=1;
        aout.click();
      }else
        if (aerr != null && aut == 0){
        aut=1;
        aerr.click();
      }
    }
      else
        if(cur_url.indexOf('train-search') > -1  && au_bo == 0){
			usr_logged=document.getElementById('loginText');
          //imagezoom();
          if (usr_logged != null && login_det_fill == 0)
			{
			completeLogin();
				}
			else
			{
			if (usr_logged == null)
				{
                  fillJryDetails();
				closeFailedTrxnDialog();
                }}
		}
		else if(cur_url.indexOf('train-list') > -1 && au_bo == 0)
		{
			login_det_fill=0;
			uid_fill=0;
			//pwd_fill=0;
			//cap_foc=0;
			//otp_sel=0;
			jrny_filled=0;
			frm_stn_fill=0
			to_stn_fill=0;
			jry_date_fill=0;
         
			if (no_trns == 0)
			{
				if(qta_chg == 0)
				{
					chooseQuota();
				}
				else if (qta_chg == 1 && cls_sel ==0)
				{
					findTrain();
				}
				else if(cls_sel == 1 && chk_avl_dn == 0 )
				{
					checkAvailability();
				}
				else if (chk_avl_dn == 1 && bk_nw_sel == 0)
				{
					checkBookNow();
				}
				else if (bk_nw_sel == 1 )
				{
					clkBooknow();
				}
			}
			else
			{
				return;
			}
             iagri=querySelectorAll('p-footer button');
              if (iagri != null && iagri.innerText.indexOf("I Agree") > -1)
              {iagri.dispatchEvent(clk);}
		}
		else if (cur_url.indexOf('psgninput') > -1)
            { 		
			if(psgn_details_filled == 0)
			{
              //sessionStorage.clr = 1;
				fillPsgnInfo();
			}
			else
			{
				fillSecurityQuestions();
			}
		}
		else if (cur_url.indexOf('reviewBooking')  > -1)
		{   
			reviewBooking();imagezoom();
		}
		else if(cur_url.indexOf('bkgPaymentOptions') > -1)
		{
			if(pymt_mtd_sel == "0")
			{
				findPaymentMethod();
			}
			}
		else if (cur_url.indexOf('booking-confirm') > -1)
		{
			CheckBookingStatus();
			if (data_pre == 0)
			{
				return null;
			}
		}
      else if (cur_url.indexOf('update-profile') > -1)
        {
         if(update == 0){fillque();}
        }
	}
	
	minimizeDisha();
	setTimeout(fillDetails,1000);
}

function minimizeDisha()
{
	chtbt=document.getElementById('chtbticonWrap')
	if (chtbt != null)
	{
		if (chtbt.className.indexOf('minimize') == -1 )
		{
			chtbt.className="large minimize"
		}
	}
	cbtwrp=document.getElementById('cb-wrap');
	if(cbtwrp != null)
	{
		if(cbtwrp.style.display != "none")
		{
			cbtwrp.style.display="none"
		}
	}
}
function fillque()
{
 var tre=document.querySelectorAll('app-update-profile label')[4];
 var tre1=tre.innerHTML;
 var tren= Number(tre1);  
  var dob = tre1.split("-");
 var tre2= dob[0]+dob[1]+dob[2];
  var mbq=document.querySelectorAll('app-update-profile label')[5];
 var mbq1=mbq.innerHTML;
 var mbqn= Number(mbq1);  
  var mon = mbq1.split("-");
 var mbq2= mon[1];
 var maq=document.querySelectorAll('app-update-profile small')[5];
 var maq1=maq.innerHTML;
 if(tren != ""){ 
   document.getElementById('qdob').value=tre2;
   document.getElementById('qmo').value=mbq2;
   document.getElementById('mail').value=maq1;
   update=1;
   }
  }


function CheckBookingStatus()
{
	psgn_details=document.querySelectorAll('app-psgn-detail')[0];
	if (psgn_details != null)
	{
		psgn_lbls=psgn_details.getElementsByClassName('psgnLabel');
		if (psgn_lbls != null)
		{
			psgn_lbls_len=psgn_lbls.length;
			for (i=0;i<psgn_lbls_len;i++)
			{
				if (psgn_lbls[i].innerText.indexOf('Booking') > -1)
				{
					psgn_bk_lbl=psgn_lbls[i];
					if(psgn_bk_lbl.nextElementSibling.innerText.indexOf('CNF') > -1 && cnf_tkt == 0 )
					{
						cnf_tkt=1;
						document.querySelectorAll(".print_btn.ng-star-inserted")[0].click();
						break;
					}
				}
			}
			
		}
	}
}
function findPayment()
{
	pay_med=storb[1];
	pay_rd_but=document.getElementById(pay_med);
	if (pay_rd_but != null)
       {
        pay_rd_but.checked=true;
		pay_rd_but.dispatchEvent(chg);
		pay_rd_but.click();
		pay_but_par=pay_rd_but.parentNode
		if (pay_but_par != null)
		{
			pay_but_clk=pay_but_par.getElementsByTagName('button')[0];
			if(pay_but_clk != null && pay_fwd != "0" && au_bo==0 )
			{		
			pay_but_clk.click();
			}else{
              bhim_pay=document.getElementById('vpa');
              if(bhim_pay != null){
              document.getElementById('vpa').dispatchEvent(blr);
				document.getElementById('vpa').dispatchEvent(ipt);
				document.getElementById('vpa').value= "@bhimupi.com";
				document.getElementById('vpa').dispatchEvent(coe);
                document.getElementById('vpa').dispatchEvent(cos);
               if(pay_fwd != "0" && au_bo==0 ){document.querySelectorAll('.form-group button')[0].click();}
                  }else{
                    
              var paybook =confirm(localStorage.seat+localStorage.fare+":Book");if (paybook == true) {pay_but_clk.click();}}
            }}
      
        }else{
                    irctc_w=document.querySelectorAll('form-control ng-dirty ng-valid ng-touched');
                    irctc_w1=document.querySelectorAll('.form-group input')[0];
                    if(irctc_w != null){
                irctc_w1.dispatchEvent(blr);
				irctc_w1.dispatchEvent(ipt);
				irctc_w1.value= "bhimupi password";
				irctc_w1.dispatchEvent(coe);
                irctc_w1.dispatchEvent(cos);
			if(pay_fwd != "0" && au_bo==0 ){document.querySelectorAll('.form-group button')[0].click();}
			
                    }}
}

function checkPaymentMethod()
{
	pymt_mthds=document.querySelectorAll('app-payment form ul li a');
	if(pymt_mthds != null)
	{
		for (i=0;i<pymt_mthds.length;i++)
		{
			if (pymt_mthds[i].getAttribute('aria-selected') == "true" )
			{
              var ptmck = pymt_mthds[i].innerText.toUpperCase();
              var ptm1=storb[0].toUpperCase();
				if(ptmck.indexOf(ptm1) > -1)
				{
					pymt_mtd_sel=1;
                  findPayment();
				}}}}}

function findPaymentMethod()
{     var ptm1=storb[0].toUpperCase();
	pay_sel=ptm1;
	pay_opts=document.querySelectorAll('app-payment form ul li a');
	if (pay_opts != null)
	{
		pay_opts_len=pay_opts.length;
		for (i=0; i<pay_opts_len; i++)
		{
         var ptm = pay_opts[i].innerText.toUpperCase();
          	if(ptm.indexOf(pay_sel) > -1 )
			{
			pay_opts[i].click();
             checkPaymentMethod();
			}}}}
function reviewBooking(){ 
  rev_but = document.querySelectorAll('.passenger_details [type="submit"]')[0];
  bnkadd= document.getElementById('sbinet');
		if (bnkadd == null)
		{
  var element = document.querySelectorAll('.bottomDiv p')[0]; 
    element.innerHTML = '<input type="button" value="SBI Net" id="sbinet"><input type="button" value="PNB NET" id="pnbnet" onclick="return false"><input type="button" value="HDFC Debid" id="hdfcdebid" onclick="return false"><input type="button" value="PAY TM" id="paytm" onclick="return false"><input type="button" value="AIRTEL MONEY" id="airtelmoney" onclick="return false">';
          document.getElementById("sbinet").addEventListener('click', function (){document.getElementById('bank').value="credit_1";rev_but.click();});
          document.getElementById("pnbnet").addEventListener('click', function (){document.getElementById('bank').value="credit_34";rev_but.click();});
          document.getElementById("hdfcdebid").addEventListener('click', function (){document.getElementById('bank').value="credit_57";rev_but.click();});
          document.getElementById("paytm").addEventListener('click', function (){document.getElementById('bank').value="credit_71";rev_but.click();});
          document.getElementById("airtelmoney").addEventListener('click', function (){document.getElementById('bank').value="credit_93";rev_but.click();});
        }
          var abt = document.querySelectorAll('app-availability-summary .ng-star-inserted')[0];
   var abt1= abt.innerText;
   var abt2=abt1.split("-");
  localStorage.seat=abt1;
  var fa = document.querySelectorAll('app-fare-summary span ul span')[0];
    var far= fa.innerText;
  var amo = far.split(",");
  var amou=amo[0]+amo[1];
  var amo1 = amou.slice(1, );
  var tfare=amo1.split(".");
  localStorage.fare=far;  
  var abst=localStorage.seat+localStorage.fare;
  document.getElementById('sf').value=abst;
  if(stor[25].indexOf('TATKAL') > -1 || stor[25].indexOf('GENERAL') > -1){
   if (abt != null){ var avad=Number(stor[27]);
	if (rev_but != null && au_bo==0  && abt2[0]=="AVAILABLE" && Number(abt2[1])>=avad)
	{     
      pay_fwd=1;
      pymt_mtd_sel=0;     
      }else
    { if(au_bo==0  && abt2[0]=="AVAILABLE"){
       pay_fwd=0;
      pymt_mtd_sel=0;     
       }}
      }}else
  {var afare=Number(stor[26]);
   var afare1=Number(tfare[0]);
    if(stor[25].indexOf('PREMIUM') > -1 && afare>=afare1  && abt2[0]=="AVAILABLE"){
    pay_fwd=1;
      pymt_mtd_sel=0;     
       }else{
        if(au_bo==0  && abt2[0]=="AVAILABLE"){
       pay_fwd=0;
      pymt_mtd_sel=0;     
       }}}
  var consub=document.querySelectorAll('p-confirmdialog button')[1];
  if(consub){consub.click();}
  }
function fillSecurityQuestions()
{
	var sec_dialog=""
	var sec_ques=""
	var sec_ans=""
	irctc_dialogs=document.querySelectorAll('app-passenger-input p-dialog')
	if(irctc_dialogs != null)
	{
		for (i=0;i<irctc_dialogs.length;i++)
		{
			if (irctc_dialogs[i].childNodes[0].style.display == "block")
			{
				sec_dialog=i;
			}
		}
		if(sec_dialog != "")
		{
			sec_dialog_div=irctc_dialogs[sec_dialog].childNodes[0];
			if(sec_dialog_div != null)
			{
				sec_ques_tag=sec_dialog_div.getElementsByTagName('p')[0];
				if(sec_ques_tag != null)
				{
					sec_ques=sec_ques_tag.innerText
				}
			}
			if(sec_ques != "")
			{
				if(sec_ques.indexOf('email') > -1)
				{
					sec_ans=stor1[4]
				}
				else if (sec_ques.indexOf('ddMMyyyy') > -1)
				{
					sec_ans=stor1[3]
				}
				else if(sec_ques.indexOf('mobile') > -1)
				{
					sec_ans=stor1[2]
				}
				else if(sec_ques.indexOf('Ewallet') > -1)
				{
					sec_ans="yes";
				}
				else if(sec_ques.indexOf('login') > -1)
				{
					sec_ans=stor1[0]
				}
			}
			if(sec_ans != "" && ( sec_ans != "yes" || sec_ans != "no") )
			{
				sec_inp=sec_dialog_div.getElementsByTagName('input')[0]
				if(sec_inp != null)
				{	sec_inp.value=sec_ans;
					sec_inp.dispatchEvent(new Event('input',{bubbles:!0}));
					sec_inp.dispatchEvent(new Event('blr',{bubbles:!0}));
				}
				sec_sub=sec_dialog_div.getElementsByTagName('button')[0]
				if(sec_sub != null)
				{
					sec_sub.click();
				}
			}
			else if(sec_ans != "" && ( sec_ans == "yes" || sec_ans == "no") )
			{
				sec_buts=sec_dialog_div.getElementsByTagName('button')
				if(sec_buts != null)
				{
					if(sec_ans == "yes")
				{
						sec_buts[0].click();
					}
					else if(sec_ans == "no")
					{
						sec_buts[1].click();
					}}}
        }
//  else
//    {
//  if(document.getElementById('post4').value!=document.querySelector('select#address-postOffice').value){
//   document.getElementById('pos1').value=document.querySelector('#aaa1').value;
 //  document.getElementById('pos2').value=document.querySelector('#aaa4').value;
//   document.getElementById('post4').value=document.querySelector('select#address-postOffice').value;
//   document.getElementById('post3').value=document.querySelector('select#address-City').value;
//    document.getElementById('save').click();
 //   }
 //     psgn_details_filled=0;
  var fillco = document.querySelectorAll('.form-inline [type="submit"]')[0];
// fillco.dispatchEvent(clk);
 if(fillco != null &&(stor[25].indexOf('TATKAL') > -1 || stor[25].indexOf('PREMIUM') > -1)  && au_bo==0 && sessionStorage.clr <=1){ sessionStorage.clr = Number(sessionStorage.clr)+1;fillco.dispatchEvent(clk); }   //फॉर्म फिल question फिल सबमिट 
 //   }
    }
 }
function fillPsgnInfo()
{
 psgn_cnt=stor[16] 
  var jp = document.querySelectorAll('app-passenger');  
  if(jp[a] && au_bo ==0){    
    var b=document.querySelectorAll('app-passenger')[a];    
    var i=a+1;
    var pf=document.querySelector('div:nth-child('+i+') > div > div:nth-child(2) > app-passenger > div > div:nth-child(1) input');
    var fo=pf.value;
   var ps=stor[n];
    // if(document.querySelector('div:nth-child('+i+') > div > div:nth-child(2) > app-passenger > div > div:nth-child(1) input').value==""){
    //var pt="";
    //for(var b=0;b<ps.length;b++){pt+=ps.slice(b,b+1);
//document.querySelector('div:nth-child('+i+') > div > div:nth-child(2) > app-passenger > div > div:nth-child(1) input').dispatchEvent(new Event('keydown',{bubbles:!0}));
//document.querySelector('div:nth-child('+i+') > div > div:nth-child(2) > app-passenger > div > div:nth-child(1) input').focus();
//document.querySelector('div:nth-child('+i+') > div > div:nth-child(2) > app-passenger > div > div:nth-child(1) input').dispatchEvent(new Event('keyup',{bubbles:!0}));
//document.querySelector('div:nth-child('+i+') > div > div:nth-child(2) > app-passenger > div > div:nth-child(1) input').dispatchEvent(new Event('input',{bubbles:!0}));
//document.querySelector('div:nth-child('+i+') > div > div:nth-child(2) > app-passenger > div > div:nth-child(1) input').dispatchEvent(new Event('blur',{bubbles:!0}));}//}
b.querySelector('div.form-group:nth-of-type(2) input').dispatchEvent(new Event('blur'));
b.querySelector('div.form-group:nth-of-type(2) input').value=stor[n+1];
b.querySelector('div.form-group:nth-of-type(2) input').dispatchEvent(new Event('input'));
b.querySelector('div.form-group:nth-of-type(3) select').dispatchEvent(new Event('blur'));
b.querySelector('div.form-group:nth-of-type(3) select').value=stor[n+2];
b.querySelector('div.form-group:nth-of-type(3) select').dispatchEvent(new Event('change'));
b.querySelector('div.form-group:nth-of-type(4) select').dispatchEvent(new Event('blur'));
b.querySelector('div.form-group:nth-of-type(4) select').value=stor[n+3];
b.querySelector('div.form-group:nth-of-type(4) select').dispatchEvent(new Event('change'));
    var pf1=pf.value;
   if(ps.length<=pf1.length && pf1 != ps){
     pf.dispatchEvent(new Event('keydown',{bubbles:!0}));
     pf.value=ps;
     pf.dispatchEvent(new Event('keyup',{bubbles:!0}));
     pf.dispatchEvent(new Event('input',{bubbles:!0}));
     pf.dispatchEvent(new Event('blur',{bubbles:!0}));
     c=1;
   }
 if(psgn_cnt > i && c==1){c=0;a=a+1;n=n+4;document.querySelectorAll('a span.prenext')[0] .click();}
    if(fo==""){pf.focus();}
    if(fo !="" && pf1 == ps && document.querySelector('#aaa1').value ==""){document.querySelector('#aaa1').focus();}
  }
    var pin1 = localStorage.getItem("pin");
    if(document.querySelector('#aaa4').value==""){
document.querySelector('#aaa4').dispatchEvent(new Event('blur'));
document.querySelector('#aaa4').value=stor[34];
document.querySelector('#aaa4').dispatchEvent(new Event('input'));
document.querySelector('#aaa4').dispatchEvent(new Event('change'));
  }
var cty1 = localStorage.getItem("cty");  
if(document.querySelector('#aaa4').value ==stor[34] && document.querySelector('select#address-City').value==""){
document.querySelector('select#address-City').dispatchEvent(new Event('blur'));
document.querySelector('select#address-City').value=stor[35];
document.querySelector('select#address-City').dispatchEvent(new Event('input'));
document.querySelector('select#address-City').dispatchEvent(new Event('change'));
}
  
var pst1 = localStorage.getItem("pst");
if(document.querySelector('select#address-City').value ==stor[35] && document.querySelector('select#address-postOffice').value==""){    
document.querySelector('select#address-postOffice').dispatchEvent(new Event('blur'));
document.querySelector('select#address-postOffice').value=stor[36];
document.querySelector('select#address-postOffice').dispatchEvent(new Event('input'));
document.querySelector('select#address-postOffice').dispatchEvent(new Event('change'));
}
    
      cnfrm_brths= document.getElementById('confirmberths');
		if (cnfrm_brths != null && cnfrm_brths.checked == false)
		{
			cnfrm_brths.checked=true;
			cnfrm_brths.dispatchEvent(chg);
		}
           var d22 = new Date();
          var n22 = d22.getSeconds();
          var m22 = d22.getMinutes();
         var c22=(m22*60)+n22;
          var bb22;
    if (stor[17] != "")
	{
		mob_num=document.getElementById('mobileNumber');
		if (mob_num != null && au_bo ==0 && mob_num.value!=stor[17])
		{
         
        sessionStorage.bb22=c22+45;
          mob_num.dispatchEvent(blr);
			mob_num.value=stor[17];
			mob_num.dispatchEvent(ipt);
		}
	}
 // if(c22>sessionStorage.bb22){psgn_details_filled=1;}
    ins_opt_no=document.getElementById('travelInsuranceOptedNo');
			if (ins_opt_no != null && ins_opt_no.checked == false)
			{
				ins_opt_no.checked=true;
				ins_opt_no.dispatchEvent(chg);	
			}
  var ad1=document.querySelector('#aaa1').value;
  var add1=stor[33];
  if(ad1.length >= add1.length && ad1 != add1){
document.querySelector('#aaa1').dispatchEvent(new Event('keydown',{bubbles:!0}));
document.querySelector('#aaa1').value=add1;
document.querySelector('#aaa1').dispatchEvent(new Event('keyup',{bubbles:!0}));
document.querySelector('#aaa1').dispatchEvent(new Event('input',{bubbles:!0}));
document.querySelector('#aaa1').dispatchEvent(new Event('blur',{bubbles:!0}));
  document.getElementById('pos1').value=document.querySelector('#aaa1').value;
   document.getElementById('pos2').value=document.querySelector('#aaa4').value;
   document.getElementById('post4').value=document.querySelector('select#address-postOffice').value;
   document.getElementById('post3').value=document.querySelector('select#address-City').value;
    document.getElementById('save').click();   
//setTimeout(function(){psgn_details_filled=1;},2000);
  }
 if(c22>sessionStorage.bb22 && ad1 == add1){psgn_details_filled=1;}  
}  
function clck_rfsh()
{
	var auto_refresh_ele="";
	console.log('Clicking the Refresh Button');
	chk_tag=trn_box.getElementsByTagName('a');
	if(chk_tag != null)
	{
		for(i=0;i<chk_tag.length;i++)
		{
			if(chk_tag[i].id.indexOf('check-availability') >-1)
			{
				auto_refresh_ele=i;
			}
		}
		if(auto_refresh_ele != "")
		{
			chk_tag[auto_refresh_ele].click();
			
		}
	}
	clearTimeout(auto_rfrsh_to);
}

function clckAutoRfrsh()
{
	var dt = new Date();
	var tz = dt['getTimezoneOffset']();
    var ist_off = 330;
    var dt1 = new Date(dt.getTime() + (ist_off + tz) * 60000);
    var rel_hr=8;
	if( stor[25].indexOf('TATKAL') > -1  || stor[25].indexOf('PREMIUM') > -1)
	{
		if(stor[24] == "2S" || stor[24] == "SL" )
		{
    		rel_hr=11;
		}
		else
		{
    		rel_hr=10;
		}
	}
	s_time=dt1;
    var rel_time = new Date(s_time.getFullYear(),s_time.getMonth(),s_time.getDate(), rel_hr,0,3);
    time_rem = (rel_time - s_time);
	time_rem_sec=time_rem/1000;
	if(time_rem >0)
	{
		auto_rfrsh_to=setTimeout(function(){anxt=1;clck_rfsh},time_rem)
	}
}


function clkBooknow()
{
   avlt=trn_box.querySelectorAll('.table td div span')[2];  
	bk_nw_div=bk_nw_but.parentElement;
	if (bk_nw_div != null && au_bo ==0 && avlt.innerText.indexOf("AVAILABLE") > -1)
	{
		if (bk_nw_div.style.visibility == "visible")
		{
            sessionStorage.clr=1;
			bk_nw_but.dispatchEvent(clk);
		}
		else
		{
			
				if(auto_rfrsh_to == "")
				{
					clckAutoRfrsh()
				}else{
      if(anxt==1 && bk_nw_div.style.visibility != "visible" && sessionStorage.clr <=10){sessionStorage.clr = Number(sessionStorage.clr)+1;clck_rfsh();}//ADD 15/09/2020
                }
                }
	}
  var consub=document.querySelectorAll('p-confirmdialog button')[1];
  if(consub){consub.click();}
	bk_nw_sel=0;
}

function bokint(){if(anxt==1 && bk_nw_div.style.visibility != "visible" && sessionStorage.clr <=8){sessionStorage.clr = Number(sessionStorage.clr)+1;clck_rfsh();}}

function checkBookNow()
{
	if (stor[22] != null)
	{
		var jdate    = stor[22].split('-');
		var mdf_date = new Date(jdate[2],jdate[1]-1,jdate[0]);
 		var s_date = mdf_date.toString().split(' ');
		var f_date = s_date[2] + ' ' + s_date[1] + ' ' + s_date[3]
		aval_dates=trn_box.querySelectorAll("p-panel td");
		if (aval_dates.length > 0)
		{
			aval_dates_len=aval_dates.length;
			if ( aval_dates_len > 0)
			{
				for (i=0;i<aval_dates_len;i++)
				{
					if(aval_dates[i].innerText.indexOf(f_date) > -1)
					{
						dt_idx=i;
						break;
					}
				}
				if (dt_idx >= 0)
				{
					bk_nw_but=aval_dates[dt_idx].querySelectorAll('button')[0];
					if(bk_nw_but != null)
					{
				var anxt=0;		bk_nw_sel=1;
					}
				}
			}
		}
	}
}

function checkAvailabilityClicked()
{
	aval_dates=trn_box.getElementsByTagName('td');
	if (aval_dates != null)
	{
		chk_avl_dn=1;
	}
}

function checkAvailability()
{
	chk_but=trn_box.getElementsByTagName('button')[0]
	if( chk_but != null && au_bo == 0)
	{
		if( chk_but.innerText.indexOf('Check availability & fare') > -1)
		{
			
			chk_but.dispatchEvent(clk);
			
		}
	}
	checkAvailabilityClicked();
}

function findTrain()
{
	trn_lst=document.getElementsByClassName("train_avl_enq_box");
	if (trn_lst.length > 0)
	{
		trn_lst_len=trn_lst.length;
		trn_num=stor[23];
		if(search_suc == 0)
		{
		if (trn_num != '' )
		{
			for ( i=0; i<trn_lst_len ; i++ )
			{
   				if(trn_lst[i].textContent.indexOf(trn_num) > -1)
   				{
   			    	
   			    	trn_lst[i].style.background="rgb(0, 255, 204)";
   			    	search_suc=1;
   			    	trn_box=trn_lst[i];
					trn_box.scrollIntoView();
   			    	
   				}
			}
			if (search_suc == 1)
			{
				chooseClass();
			}
		}}}}

function checkClass()
{
	class_sel=stor[24];
	slct_tag=trn_box.getElementsByTagName('select')[0];
	if (slct_tag != null)
	{
		if (slct_tag.value.indexOf(stor[24]) > -1)
		{
			cls_sel=1;
		}
		else if (cls_nt_fnd_toast == 1)
		{
			cls_sel=0;
		}
	}
}

function chooseClass()
{
	class_sel=stor[24];
	slct_tag=trn_box.getElementsByTagName('select')[0];
	if (slct_tag != null)
	{
		slct_opt=slct_tag.getElementsByTagName('option');
		if (slct_opt != null)
		{
			slct_opt_len=slct_opt.length;
			for (i=0; i<slct_opt_len; i++)
			{
				if(slct_opt[i].innerText.indexOf(class_sel) > -1)
				{
					cls_found=1;
					slct_value=slct_opt[i].value;
					slct_tag.value=slct_value;
					slct_tag.dispatchEvent(chg);
				}}}}
	checkClass();
}

function checkQuota()
{
	qta_bar=document.querySelectorAll('.search_div')[0];
	if (qta_bar != null)
	{
		qta_dwn=qta_bar.querySelectorAll('.ui-dropdown-label')[0];
		if (qta_dwn != null)
		{
			qta_val=qta_dwn.innerText;
			if (qta_val.indexOf(stor[25]) > -1 )
			{
				qta_chg=1;
			}
		}
	}
}

function chooseQuota()
{
	quota_sel=stor[25]
	quota_bar=document.querySelectorAll('.search_div')[0];
	if (quota_bar != null)
	{
		quota_dwn=quota_bar.querySelectorAll('.ui-dropdown-trigger')[0];
		if (quota_dwn != null)
		{
			quota_dwn.click();
			quota_list=quota_bar.querySelectorAll('.ui-dropdown-item');
			if (quota_list.length > 0)
			{
				quota_list_len=quota_list.length;
				for ( i=0; i<quota_list_len ; i++ )
				{
					if (quota_list[i].innerText.indexOf(quota_sel) > -1)
					{
						quota_list[i].click();
					}
				}
			}
			else
			{
				findTrain();
			}
		}
	}
	checkQuota();
}

function closeFailedTrxnDialog()
{
	trx_header=document.getElementById('last_txn_header');
	if(trx_header != null)
	{
		trx_chld_node=trx_header.childNodes[0]
		if(trx_chld_node != null)
		{
			if(trx_chld_node.style.display == "block")
			{
				trx_cls_btn = trx_header.getElementsByTagName('button')[1]
				if(trx_cls_btn != null)
				{
					trx_cls_btn.click();
				}
			}
		}
	}
}


function checkJryDetails()
{
	frm_stn  = document.querySelector("#origin input");
	if (frm_stn != null && frm_stn.value == stor[20] && stor[20] != "")
	{
		frm_stn_fill=1;
	}
	to_stn   = document.querySelector("#destination input");
	if (to_stn != null && to_stn.value == stor[21] && stor[21] != "")
	{
		to_stn_fill=1;
	}
	if ( stor[22] != "" )
	{
		jry_date = document.querySelector("p-calendar input");
		if (jry_date != null && jry_date.value == stor[22])
		{
			jry_date_fill=1;
		}
	}
	else
	{
		jry_date_fill=1;
	}
	if (frm_stn_fill == 1 && to_stn_fill == 1 && jry_date_fill == 1)
	{
		jrny_filled=1;
		fnd_trn_but = document.querySelector("app-jp-input .search_btn");
		if (fnd_trn_but != null && au_bo == 0)
		{
			fnd_trn_but.click();
		}
	}
}

function fillJryDetails()
{
	if (jrny_filled == 0)
	{
      update = 0;
      search_suc=0;
     qta_chg = 0;
     cls_sel = 0;
     chk_avl_dn = 0
     bk_nw_sel = 0
      a=0;
      n=0;
      sc=0;
      c=0;
     psgn_details_filled=0;
      sessionStorage.clr = 1;
		frm_stn  = document.querySelector("#origin input");
		to_stn   = document.querySelector("#destination input");
		jry_date = document.querySelector("p-calendar input");

		if (frm_stn != null && stor[20] != "" && frm_stn_fill == 0 )
		{
			//console.log(2);
			frm_stn.dispatchEvent(foc);
			frm_stn.dispatchEvent(kdwn);
			frm_stn.dispatchEvent(kup);
			frm_stn.value = stor[20];
			frm_stn.dispatchEvent(blr);
			frm_stn.dispatchEvent(ipt);	
		}

		if ( to_stn != null && stor[21] != "" && to_stn_fill == 0 )
		{
			to_stn.dispatchEvent(foc);
			to_stn.dispatchEvent(kdwn);
			to_stn.dispatchEvent(kup);
			to_stn.value = stor[21];
			to_stn.dispatchEvent(blr);
			to_stn.dispatchEvent(ipt);
		}

		if (jry_date != null && stor[22] != "" && jry_date_fill == 0 )
		{
			jry_date.value=stor[22];
			jry_date.dispatchEvent(kdwn);
			jry_date.dispatchEvent(ipt);
		}
		checkJryDetails();
	}
}
function imagezoom(){
  var clen=document.querySelectorAll('app-captcha input')[0];
  var cim=document.querySelectorAll('app-captcha')[0];
  if(cim != null && clen.value == "" && uid_cap_err.value != "") {
 document.querySelectorAll('app-captcha img')[0].style.height="65px"; 
 document.querySelectorAll('app-captcha input')[0].style.fontSizeAdjust = "2";
document.querySelectorAll('app-captcha input')[0].focus();
  }
if(cim != null && clen.value != "") {
 t=10;
var auts = setInterval(acap ,1000);
function acap() {
t=t-1;
  var dat = new Date();
smin = dat.getMinutes();
ssec = dat.getSeconds();
if (t <= 0 && smin >= 50) {    
   var sbu=document.querySelectorAll('.modal-body button')[0];  
  if(uid != "" && clen.value != "") {sbu.dispatchEvent(clk);clearInterval(auts);}//sbu.click();
  clearInterval(auts);
  }}}}
function checkLogin()
{
	uid=document.getElementById('userId');
	if (uid != null && uid.value == stor1[0] )
	{
		uid_fill=1;
	}
	pwd=document.getElementById('pwd');
	if ( pwd != null && pwd.value == stor1[1] )
	{
		pwd_fill=1;
	}
	if ( uid_fill == 1 && pwd_fill == 1)
	{
		login_det_fill=1;
	}}
function completeLogin()
{
	chk_error = document.getElementsByClassName('loginError');
	if(chk_error != null){
      if(la<3) {usr_logged.click();}
		for(i=0;i<chk_error.length;i++)
		{
			uid_cap_err=document.getElementById('userId');
            pwd_cap_err=document.getElementById('pwd');
			if(uid_cap_err != null && pwd_cap_err != null)
			{
				if(uid_cap_err.value == "" && pwd_cap_err.value == "")
				{la=la+1;
            uid=document.getElementById('userId');
			uid.dispatchEvent(blr);
			uid.value=stor1[0];
			uid.dispatchEvent(ipt);
            pwd=document.getElementById('pwd');
			pwd.dispatchEvent(blr);
			pwd.value=stor1[1];
			pwd.dispatchEvent(ipt);
				}
			}
			
       if(uid_cap_err.value != "" && pwd_cap_err.value != "" ) {
         if(uid_cap_err.value == "icsceg017235"){localStorage.au_bo=1;}
         if(document.querySelectorAll('app-captcha')[0]){imagezoom();}
         if(document.getElementById('nlpAnswer') != null && document.getElementById('nlpAnswer').value=="" && uid_cap_err.value != ""){document.getElementById('nlpAnswer').focus();}
       }}}}
