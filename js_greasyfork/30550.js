// ==UserScript==
// @namespace visa_apply
// @name     Auto_Fill_In_NZ_VISA 
// @description Fill in and submit automatically
// @include  https://onlineservices.immigration.govt.nz/WorkingHoliday*
// @include  https://onlineservices.immigration.govt.nz/PaymentGateway*
// @include  https://webcomm.paymark.co.nz*
// @version     5
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/30548-waitforkeyelements/code/waitForKeyElements.js?version=200253
// @require https://greasyfork.org/scripts/30549-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=200254
// @grant  GM_getValue
// @grant  GM_setValue
// @grant  GM_deleteValue
// @grant  GM_addStyle
// @grant  GM_registerMenuCommand
// @grant  unsafeWindow
// @compatible  firefox
// @downloadURL https://update.greasyfork.org/scripts/30550/Auto_Fill_In_NZ_VISA.user.js
// @updateURL https://update.greasyfork.org/scripts/30550/Auto_Fill_In_NZ_VISA.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a major design
    change introduced in GM 1.0.
    It restores the sandbox.
*/
    //GM_setValue("state", "0");
    //alert(GM_getValue("state", "0"));
    
function actionFunction (jNode) {
    GM_options = GM_config.get();
    if($("#ContentPlaceHolder1_wizardPageFooter_wizardPageNavigator_submitImageButton").length>0){
    GM_setValue("state", "submit");
    $("#ContentPlaceHolder1_wizardPageFooter_wizardPageNavigator_submitImageButton").click();
    }
if($("h2").text().trim()=="Personal details"){
    var gender=2;
    if(GM_options.Gender=="m"){
        gender=1;
    }
    var country=216;//TW
    if(GM_options.Country=="c"){//China
        country=44;
    }
    javascript:( function() {  
    document.getElementById('ContentPlaceHolder1_personDetails_genderDropDownList').options[gender].selected="selected";
    document.getElementById('ContentPlaceHolder1_personDetails_dateOfBirthDatePicker_DatePicker').value=GM_options.birthDate;
    document.getElementById('ContentPlaceHolder1_addressContactDetails_address_streetNumberTextbox').value=GM_options.streetNum;
    document.getElementById('ContentPlaceHolder1_addressContactDetails_address_address1TextBox').value=GM_options.address1;
    document.getElementById('ContentPlaceHolder1_addressContactDetails_address_suburbTextBox').value=GM_options.suburb;
    document.getElementById('ContentPlaceHolder1_addressContactDetails_address_cityTextBox').value=GM_options.city;
    document.getElementById('ContentPlaceHolder1_personDetails_CountryDropDownList').options[country].selected="selected";
    document.getElementById('ContentPlaceHolder1_addressContactDetails_address_countryDropDownList').options[country].selected="selected";
    document.getElementById('ContentPlaceHolder1_addressContactDetails_contactDetails_emailAddressTextBox').value=GM_options.Email;
    document.getElementById('ContentPlaceHolder1_hasAgent_representedByAgentDropdownlist').options[1].selected="selected";
    document.getElementById('ContentPlaceHolder1_hasCreditCard_hasCreditCardDropDownlist').options[2].selected="selected";
    document.getElementById('ContentPlaceHolder1_communicationMethod_communicationMethodDropDownList').options[1].selected="selected";
    document.getElementById('ContentPlaceHolder1_wizardPageFooter_wizardPageNavigator_nextImageButton').click();
    })()
}else if($("h2").text().trim()=="Identification"){
        GM_options = GM_config.get();
    javascript:( function() {  
    document.getElementById('ContentPlaceHolder1_identification_passportNumberTextBox').value=GM_options.passportNumber;
    document.getElementById('ContentPlaceHolder1_identification_confirmPassportNumberTextBox').value=GM_options.passportNumber;
    document.getElementById('ContentPlaceHolder1_identification_passportExpiryDateDatePicker_DatePicker').value=GM_options.passportExpiryDate;
    document.getElementById('ContentPlaceHolder1_identification_otherIdentificationDropdownlist').options[3].selected="selected";
    document.getElementById('ContentPlaceHolder1_identification_otherIssueDateDatePicker_DatePicker').value=GM_options.otherIssueDate;
    document.getElementById('ContentPlaceHolder1_wizardPageHeader_nav_sectionTabs_TabHeaders_tabButton_1').click();
    })()
}else if($("h2").text().trim()=="Health"){
    javascript:( function() {  
document.getElementById('ContentPlaceHolder1_medicalConditions_renalDialysisDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_medicalConditions_tuberculosisDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_medicalConditions_cancerDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_medicalConditions_heartDiseaseDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_medicalConditions_disabilityDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_medicalConditions_hospitalisationDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_medicalConditions_residentailCareDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_medicalConditions_pregnancy_pregnancyStatusDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_medicalConditions_tbRiskDropDownList').options[2].selected="selected";
document.getElementById('ContentPlaceHolder1_wizardPageFooter_wizardPageNavigator_nextImageButton').click();
})()
}else if($("h2").text().trim()=="Character"){
    javascript:( function() { 
document.getElementById('ContentPlaceHolder1_character_imprisonment5YearsDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_character_imprisonment12MonthsDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_character_removalOrderDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_character_deportedDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_character_chargedDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_character_convictedDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_character_underInvestigationDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_character_excludedDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_character_removedDropDownList').options[1].selected="selected";
document.getElementById('ContentPlaceHolder1_wizardPageFooter_wizardPageNavigator_nextImageButton').click();
})()
}else if($("h2").text().trim()=="Working Holiday Specific"){
    javascript:( function() { 
    var beenToNZ=1;
    if(GM_options.beenToNZ=="y"){
        beenToNZ=2;
    }
    document.getElementById('ContentPlaceHolder1_offshoreDetails_intendedTravelDateDatePicker_DatePicker').value="9 December, 2017";
    document.getElementById('ContentPlaceHolder1_offshoreDetails_commonWHSQuestions_previousWhsPermitVisaDropDownList').options[1].selected="selected";
    document.getElementById('ContentPlaceHolder1_offshoreDetails_commonWHSQuestions_sufficientFundsHolidayDropDownList').options[2].selected="selected";
    document.getElementById('ContentPlaceHolder1_offshoreDetails_beenToNzDropDownList').options[beenToNZ].selected="selected";
    document.getElementById('ContentPlaceHolder1_offshoreDetails_whenInNZDatePicker_DatePicker').value=GM_options.whenInNZ;
    document.getElementById('ContentPlaceHolder1_offshoreDetails_requirementsQuestions_sufficientFundsOnwardTicketDropDownList').options[2].selected="selected";
    document.getElementById('ContentPlaceHolder1_offshoreDetails_requirementsQuestions_readRequirementsDropDownList').options[2].selected="selected";
    document.getElementById('ContentPlaceHolder1_wizardPageFooter_wizardPageNavigator_nextImageButton').click();
})()

}
}//END FUNCTION
function actionSubmit (jNode) {
    GM_options = GM_config.get();
if($("h2").text().trim()=="IMPORTANTImportant"){
    javascript:( function() { 
    document.getElementById('ContentPlaceHolder1_falseStatementCheckBox').checked="checked";
    document.getElementById('ContentPlaceHolder1_notesCheckBox').checked="checked";
    document.getElementById('ContentPlaceHolder1_circumstancesCheckBox').checked="checked";
    document.getElementById('ContentPlaceHolder1_warrantsCheckBox').checked="checked";
    document.getElementById('ContentPlaceHolder1_informationCheckBox').checked="checked";
    document.getElementById('ContentPlaceHolder1_healthCheckBox').checked="checked";
    document.getElementById('ContentPlaceHolder1_adviceCheckBox').checked="checked";
    document.getElementById('ContentPlaceHolder1_registrationCheckBox').checked="checked";
    document.getElementById('ContentPlaceHolder1_entitlementCheckbox').checked="checked";
    document.getElementById('ContentPlaceHolder1_permitExpiryCheckBox').checked="checked";
    document.getElementById('ContentPlaceHolder1_medicalInsuranceCheckBox').checked="checked";
    document.getElementById('ContentPlaceHolder1_submitImageButton').click();

})()
}else if($("h2").text().trim()=="APPLICATION SUBMITTED"){
    $('#ContentPlaceHolder1_homeImage').click();
}else if($('#ContentPlaceHolder1_payAnchor').length>0){
    javascript:( function() { 
    document.getElementById('ContentPlaceHolder1_payAnchor').click();
    })()
}else if($('#ContentPlaceHolder1_onlinePaymentAnchor2').length>0){
    javascript:( function() { 
    document.getElementById('ContentPlaceHolder1_onlinePaymentAnchor2').click();
    })()
}else if($("h1").text().trim()=="Online Payment"){
    javascript:( function() { 
    document.getElementById('_ctl0_ContentPlaceHolder1_payerNameTextBox').value=GM_options.payerName;    
    document.getElementById('_ctl0_ContentPlaceHolder1_okButton').click();
    GM_setValue("state", "payment");
    })()

}

}//END FUNCTION
function actionPayment () {
    GM_options = GM_config.get();
  if($("h3").text().trim()=="Immigration - WHS1: Select your preferred payment method"){
        javascript:( function() {   
            if(GM_options.cardType=="v"){
            document.getElementById('card_type_VISA').click();}
            else{
            document.getElementById('card_type_MASTERCARD').click();}                
        })()
  
}else if($("h3").text().trim()=="Immigration - WHS2: Enter Your Card Details"){
    GM_setValue("state", "0");
    javascript:( function() { 
document.getElementById('cardnumber').value=GM_options.cardNumber;
document.getElementById('cardverificationcode').value=" ";
/*
document.getElementById('expirymonth').options[2].selected="selected";#=month-1
document.getElementById('expiryyear').options[10].selected="selected";#=2017+#
*/
document.getElementById('cardholder').value=GM_options.cardHolder;

})()
}

}//END FUNCTION



GM_config.setup({
    
    Gender:{
        label: "Gender", 
        type: "select", 
		options: {m:"Male",f:"Female"},
       default: "f" 
     },
	birthDate: {
		label: "Birth Date",
		type: "text",
		default: "9 December, 1990"
	},
	streetNum: {
		label: "street Number",
		type: "text",
		default: "1"
	},
    address1: {
        label: "Street Name",
        type: "text",
        default: "University Road"
    },	
    suburb: {
        label: "suburb",
        type: "text",
        default: "Tainan"
    },
    city: {
        label: "city",
        type: "text",
        default: "Tainan"
    },
    Country: { 
      label: 'Country', 
      type: 'select', 
      options: {t:"Taiwan",c:"China"},
      default: "t" 
    },
	Email: {
		label: "Email",
		type: "text",
		default: "stupid_catt@yahoo.com.tw"
	},
    passportNumber: {
        label: "passport Number",
        type: "text",
        default: "333222777"
    },	
    passportExpiryDate: {
        label: "passport Expiry Date",
        type: "text",
        default: "9 December, 2025"
    },
    otherIssueDate: {
        label: "Date Document was Issued ( ID發照日 ) ",
        type: "text",
        default: "9 December, 2000"
    },    
    beenToNZ: {
        label: "to NZ before? ( 去過紐西蘭? )",
        type: "select",
		options: {n:"no",y:"yes"},
        default: "n" 
    },
    whenInNZ: {
        label: "If yes, when? ( 填no則空白, yes的格式為'9 December, 2000' )",
        type: "text",
        default: ""
    },   
    payerName: {
        label: "Payer Name",
        type: "text",
        default: "KB Chen"
    },	
    cardType: {
        label: "Card Type",
        type: "select",
		options: {v:"Visa",m:"Master"},
       default: "v" 
    },
    cardNumber: {
        label: "Card Number",
        type: "text",
        default: "0000111122223333"
    },
    cardHolder: {
        label: "Card Holder",
        type: "text",
        default: "KKK Chen"
    }
    

}, function() {

    GM_options = GM_config.get();
    if(GM_options.beenToNZ=="n"){
       GM_options.whenInNZ="" ;
    }else{
        if (GM_options.whenInNZ===""){
            alert("If you have been to NZ, fill in the date.\n去過紐西蘭,If yes 寫日期");
        }
    }

});
if(GM_getValue("state", "0")=="submit"){
    waitForKeyElements ($("#footer-primary"), actionSubmit);
}else if(GM_getValue("state", "0")=="0") {
    waitForKeyElements ($("#ContentPlaceHolder1_wizardPageFooter_wizardPageNavigator_nextImageButton"), actionFunction);
}else if(GM_getValue("state", "0")=="payment") {
    $(document).ready(actionPayment);
}