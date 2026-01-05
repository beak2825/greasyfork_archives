// ==UserScript==
// @author https://greasyfork.org/en/scripts/30089/versions/new
// @name irctc 19
// @namespace irctcbooking
// @grant none
// @include     https://www.irctc.co.in/**
// @description contect me butter knowedge
// @version 31
// @downloadURL https://update.greasyfork.org/scripts/30089/irctc%2019.user.js
// @updateURL https://update.greasyfork.org/scripts/30089/irctc%2019.meta.js
// ==/UserScript==
var stored_value = [];
var ipt = new Event("input");
var foc = new Event("focus");
var kup = new Event("keyup");
var blr = new Event("blur");
var kdwn  = new Event("keydown");
var chg = new Event("change");
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
var aut =0;
var abst
setInterval(function () {mainThread();}, 1000);
function mainThread()
{dta=localStorage.pdata;
  udta=localStorage.user;
 au_bo=localStorage.au_bo
    if (dta && udta) {
      dta=localStorage.pdata;
    stor = dta.split('~');
      udta=localStorage.user;
    stor1 = udta.split('~');
      		fillDetails();
			};
    	}

function fillDetails()
{
	cur_url=document.location.href;
	bg_ld=document.getElementsByClassName('loading-bg')[0];
	if( bg_ld == null)
	{
      if(cur_url.indexOf('logout') > -1 || cur_url.indexOf('error') > -1 )
		{
      var aout=document.querySelectorAll('app-logout h4 a')[0]
      var aerr=document.querySelectorAll('app-error div a')[0]
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
        if(cur_url.indexOf('train-search') > -1 ){
			usr_logged=document.getElementById('loginText');
          imagezoom();
			if (usr_logged != null && login_det_fill == 0)
			{
					usr_logged.click();
					completeLogin();
				}
			else
			{
			if (usr_logged == null)
				{fillJryDetails();
				closeFailedTrxnDialog();}
			}
		}
		else if(cur_url.indexOf('train-list') > -1)
		{
			login_det_fill=0;
			uid_fill=0;
			pwd_fill=0;
			cap_foc=0;
			otp_sel=0;
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
					//console.log(3);
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
		}
		else if (cur_url.indexOf('psgninput') > -1)
            {    imagezoom();
		
			if(psgn_details_filled == 0)
			{
				fillPsgnInfo();
				if (cap_foc == 0)
				{
					captchaCode();
				}
			}
			else
			{
				fillSecurityQuestions();
			}
		}
		else if (cur_url.indexOf('reviewBooking')  > -1)
		{
			reviewBooking();
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
	pay_med=stor1[2];
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
			}else{var paybook =confirm(localStorage.seat+localStorage.fare+":Book");if (paybook == true) {pay_but_clk.click();}}
      
        }}}

function checkPaymentMethod()
{
	//console.log('code to check the payment method');
	pymt_mthds=document.querySelectorAll('app-payment form ul li a');
	if(pymt_mthds != null)
	{
		for (i=0;i<pymt_mthds.length;i++)
		{
			if (pymt_mthds[i].getAttribute('aria-selected') == "true" )
			{
              var ptmck = pymt_mthds[i].innerText.toUpperCase();
              var ptm1=stor1[3].toUpperCase();
				if(ptmck.indexOf(ptm1) > -1)
				{
					pymt_mtd_sel=1;
                  findPayment();
				}}}}}

function findPaymentMethod()
{     var ptm1=stor1[3].toUpperCase();
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
    var abt = document.querySelectorAll('app-availability-summary .ng-star-inserted')[0];
   var abt1= abt.innerText;
   var abt2=abt1.split("-"); //alert(abt2[0]+abt2[1]);
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
  if(stor[7].indexOf('TATKAL') > -1 || stor[7].indexOf('GENERAL') > -1){
   if (abt != null){ var avad=Number(stor[26]);
	if (rev_but != null && au_bo==0  && abt2[0]=="AVAILABLE" && Number(abt2[1])>=avad)
	{     
      pay_fwd=1;
      pymt_mtd_sel=0;     
      rev_but.click();
	}else
    { if(au_bo==0){//alert(abt1 +"||"+far);
       pay_fwd=0;
      pymt_mtd_sel=0;     
      rev_but.click();}
    }
      }}else
  {var afare=Number(stor[25]);
   var afare1=Number(tfare[0]);
    if(stor[7].indexOf('PREMIUM') > -1 && afare>=afare1){
    pay_fwd=1;
      pymt_mtd_sel=0;     
     rev_but.click();
      }else{
        if(au_bo==0){//alert(abt1+"||"+far);
       pay_fwd=0;
      pymt_mtd_sel=0;     
      rev_but.click();
      }}}
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
					sec_ans=stor1[5]
				}
				else if(sec_ques.indexOf('mobile') > -1)
				{
					sec_ans=stor1[6]
				}
				else if(sec_ques.indexOf('Ewallet') > -1)
				{
					sec_ans="no";
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
				{
					sec_inp.value=sec_ans;
					sec_inp.dispatchEvent(ipt);
					sec_inp.dispatchEvent(blr);
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
					}}}}}}

function fillPsgnInfo()
{
	psgn_cnt=stor[27]
	if (psgn_cnt != 0)
	{
		for (i=0,j=8;i<psgn_cnt;)
		{
			psgn_info_base=document.querySelectorAll("app-passenger")[i];
			if( psgn_info_base != null)
			{
				psgn_name=psgn_info_base.querySelector("div.form-group:nth-of-type(1)").getElementsByTagName('input')[0];
				if (psgn_name != null)
				{
					psgn_name.dispatchEvent(blr);
					psgn_name.value=stor[j];
					psgn_name.dispatchEvent(ipt);	
				}
				
				psgn_age=psgn_info_base.querySelector("div.form-group:nth-of-type(2)").getElementsByTagName('input')[0];
				if (psgn_age != null)
				{
					psgn_age.dispatchEvent(blr);
    				psgn_age.value=stor[j+1]
    				psgn_age.dispatchEvent(ipt);	
				}
				
				psgn_gen=psgn_info_base.querySelector("div.form-group:nth-of-type(3)").getElementsByTagName('select')[0];
				if (psgn_gen != null)
				{
					psgn_gen.dispatchEvent(blr);
    				psgn_gen.value=stor[j+2]
    				psgn_gen.dispatchEvent(chg);
				}
		
				psgn_brth=psgn_info_base.querySelector("div.form-group:nth-of-type(4)").getElementsByTagName('select')[0];
				if (psgn_brth != null)
				{
					if (stor[j+3].indexOf('sel_b') == -1)
					{
						psgn_brth.dispatchEvent(blr);
    					psgn_brth.value=stor[j+3]
    					psgn_brth.dispatchEvent(chg);
						
					}}}			
			i=i+1;
			if(i!=psgn_cnt)
			{
				document.querySelectorAll('.updatesDiv .prenext')[0].click();
			}
			
			j=j+4;
		}
	}
	
	if (stor[24] != "")
	{
		mob_num=document.getElementById('mobileNumber');
		if (mob_num != null)
		{
			mob_num.dispatchEvent(blr);
			mob_num.value=stor[24];
			mob_num.dispatchEvent(ipt);
		}
	}

	cnfrm_brths= document.getElementById('confirmberths');
		if (cnfrm_brths != null)
		{
			cnfrm_brths.checked=true;
			cnfrm_brths.dispatchEvent(chg);
		}
			
	//ins_opt_yes=document.getElementById('travelInsuranceOptedYes');
	//if (ins_opt_yes != null)
	//{
		//console.log('Filling insurance details');
	//	ins_opt=stored_value[90]
	//	if (ins_opt == 1)
	//	{
	//		ins_opt_yes.checked=true;
	//		ins_opt_yes.dispatchEvent(chg);
	//	}
	//	else
	//	{
			ins_opt_no=document.getElementById('travelInsuranceOptedNo');
			if (ins_opt_no != null)
			{
				ins_opt_no.checked=true;
				ins_opt_no.dispatchEvent(chg);	
			}
			
		//}	//}
	psgn_details_filled=1;
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
			console.log('Auto Refresh Clicked');
		}
	}
	console.log('Clearing the timeout');
	clearTimeout(auto_rfrsh_to);
}

function clckAutoRfrsh()
{
	var dt = new Date();
	console.log(dt);
    var tz = dt['getTimezoneOffset']();
    var ist_off = 330;
    var dt1 = new Date(dt.getTime() + (ist_off + tz) * 60000);
    var rel_hr=8;
	if( stor[7].indexOf('TATKAL') > -1  || stor[7].indexOf('PREMIUM') > -1)
	{
		if(stor[6] == "2S" || stor[6] == "SL" )
		{
    		rel_hr=11;
		}
		else
		{
    		rel_hr=10;
		}
	}
	console.log(rel_hr);
    s_time=dt1;
    var rel_time = new Date(s_time.getFullYear(),s_time.getMonth(),s_time.getDate(), rel_hr,0,5);
    time_rem = (rel_time - s_time);
	time_rem_sec=time_rem/1000;
	if(time_rem >0)
	{
		auto_rfrsh_to=setTimeout(clck_rfsh,time_rem)
	}
}


function clkBooknow()
{
	bk_nw_div=bk_nw_but.parentElement;
	if (bk_nw_div != null && au_bo ==0)
	{
		if (bk_nw_div.style.visibility == "visible")
		{
			bk_nw_but.click();
		}
		else
		{
			
				if(auto_rfrsh_to == "")
				{
					console.log('Autorefresh function');
					clckAutoRfrsh()
				}}
	}
	bk_nw_sel=0;
}

function checkBookNow()
{
	if (stor[5] != null)
	{
		var jdate    = stor[5].split('-');
		var mdf_date = new Date(jdate[2],jdate[1]-1,jdate[0]);
 		//mdf_date will look like Sun Mar 20 2016 00:00:00 GMT+0530 (India Standard Time)
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
						bk_nw_sel=1;
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
			
			chk_but.click();
			
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
		trn_num=stor[4];
		if(search_suc == 0)
		{
		if (trn_num != '' )
		{
			for ( i=0; i<trn_lst_len ; i++ )
			{
   				if(trn_lst[i].textContent.indexOf(trn_num) > -1)
   				{
   			    	
   			    	trn_lst[i].style.background="rgb(77, 166, 255)";
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
	class_sel=stor[6];
	slct_tag=trn_box.getElementsByTagName('select')[0];
	if (slct_tag != null)
	{
		if (slct_tag.value.indexOf(stor[6]) > -1)
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
	class_sel=stor[6];
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
			if (qta_val.indexOf(stor[7]) > -1 )
			{
				qta_chg=1;
			}
		}
	}
}

function chooseQuota()
{
	quota_sel=stor[7]
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
	if (frm_stn != null && frm_stn.value == stor[2] && stor[2] != "")
	{
		frm_stn_fill=1;
	}
	to_stn   = document.querySelector("#destination input");
	if (to_stn != null && to_stn.value == stor[3] && stor[3] != "")
	{
		to_stn_fill=1;
	}
	if ( stor[5] != "" )
	{
		jry_date = document.querySelector("p-calendar input");
		if (jry_date != null && jry_date.value == stor[5])
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
      search_suc=0;
     qta_chg = 0;
     cls_sel = 0;
     chk_avl_dn = 0
     bk_nw_sel = 0
     psgn_details_filled=0;
		frm_stn  = document.querySelector("#origin input");
		to_stn   = document.querySelector("#destination input");
		jry_date = document.querySelector("p-calendar input");

		if (frm_stn != null && stor[2] != "" && frm_stn_fill == 0 )
		{
			//console.log(2);
			frm_stn.dispatchEvent(foc);
			frm_stn.dispatchEvent(kdwn);
			frm_stn.dispatchEvent(kup);
			frm_stn.value = stor[2];
			frm_stn.dispatchEvent(blr);
			frm_stn.dispatchEvent(ipt);	
		}

		if ( to_stn != null && stor[3] != "" && to_stn_fill == 0 )
		{
			//console.log(3);
			to_stn.dispatchEvent(foc);
			to_stn.dispatchEvent(kdwn);
			to_stn.dispatchEvent(kup);
			to_stn.value = stor[3];
			to_stn.dispatchEvent(blr);
			to_stn.dispatchEvent(ipt);
		}

		if (jry_date != null && stor[5] != "" && jry_date_fill == 0 )
		{
			//console.log(4);
			jry_date.value=stor[5];
			jry_date.dispatchEvent(kdwn);
			jry_date.dispatchEvent(ipt);
		}
		checkJryDetails();
		//console.log(5);
	}
}

//function captchaCode()
//{
//	tat_cap_img=document.getElementsByClassName('captcha-img')[0];
//	if (tat_cap_img != null)
//	{
		//console.log('captcha zoom has been selected');
	//	tat_cap=document.getElementById('captcha');
	//	if (tat_cap != null)
	//	{
			//console.log('inside the captcha image box');
		//	tat_cap_img.style.width="200";
		//	tat_cap_img.style.height="50"
			
		//}
	//}
	//}
function imagezoom(){
  var clen=document.querySelectorAll('app-captcha input')[0];
  var cim=document.querySelectorAll('app-captcha')[0];
  if(cim != null && clen.value == "") {
 document.querySelectorAll('app-captcha img')[0].style.height="60px"; 
 document.querySelectorAll('app-captcha input')[0].style.fontSizeAdjust = "2";
 document.querySelectorAll('app-captcha input')[0].focus();
  }}
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
        //imagezoom();
		login_det_fill=1;
	}
}



function completeLogin()
{
	chk_error = document.getElementsByClassName('loginError');
	if(chk_error != null)
	{
		for(i=0;i<chk_error.length;i++)
		{
			if(chk_error[i].innerText.indexOf('Captcha') > -1)
			{
				cap_err=1;
			}
		}
		if(cap_err == 1)
		{
			uid_cap_err=document.getElementById('userId');
			if(uid_cap_err != null)
			{
				if(uid_cap_err.value == "" )
				{
					uid_fill=0;
				}
			}
			pwd_cap_err=document.getElementById('pwd');
			if(pwd_cap_err != null)
			{
				if(pwd_cap_err.value == "" )
				{
					pwd_fill=0;
				}
			}
			if(pwd_fill == 0 || uid_fill == 0)
			{
				login_det_fill=0;
			}
		}
	}
	if (login_det_fill == 0)
	{
		uid=document.getElementById('userId');
		if (uid != null && stor1[0] != "" && uid_fill == 0 )
		{
			uid.dispatchEvent(blr);
			uid.value=stor1[0];
			uid.dispatchEvent(ipt);
		}
		pwd=document.getElementById('pwd');
		if (pwd != null && stor1[1] != "" && pwd_fill == 0 )
		{
			pwd.dispatchEvent(blr);
			pwd.value=stor1[1];
			pwd.dispatchEvent(ipt);
		}
		checkLogin();
	}
}