// ==UserScript==
// @name         Rural Development CAF ENTRY
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  DREAM INFO SOLUTIONS
// @author       Dream Info Solutions
// @match        https://www.tnrd.gov.in/*
// @match        http://164.100.167.43/*
// @match        https://tnrd.gov.in/*
// @match        *www.tnrd.gov.in/*
// @exclude        */bplsurvey/project/bpl/temp_bpl_pip_survey_edit.php*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378373/Rural%20Development%20CAF%20ENTRY.user.js
// @updateURL https://update.greasyfork.org/scripts/378373/Rural%20Development%20CAF%20ENTRY.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( "#mem_age2" ).removeClass('major_person_validation');$( "#mem_age3" ).removeClass('major_person_validation');$( "#mem_age4" ).removeClass('major_person_validation');$( "#mem_age5" ).removeClass('major_person_validation');$( "#mem_age6" ).removeClass('major_person_validation');$( "#mem_age7" ).removeClass('major_person_validation');
//     $('.mem_age2').removeClass('mem_age5').addClass('noclass');
    $('#state_code').val('33').change();
    $('#religion_id').val('1').change();
    $('#family_card_id').val('1').change();
    $('#aadhar_card_type').val('1').change();


$('#survey_number').attr('tabindex', '1');
$('#family_head').attr('tabindex', '2');
$('#husband_or_father_name').attr('tabindex', '5');
$('#date_of_date').attr('tabindex', '6');
$('#date_of_month').attr('tabindex', '7');
$('#date_of_year').attr('tabindex', '8');
$('#house_number').attr('tabindex', '9');
$('#street_code').attr('tabindex', '10');
$('#native_place').attr('tabindex', '11');
$('#district_code').attr('tabindex', '12');
$('#state_code').attr('tabindex', '13');
$('#community_id').attr('tabindex', '14');
$('#religion_id').attr('tabindex', '15');
$('#family_card_id').attr('tabindex', '16');
$('#smart_card_number').attr('tabindex', '17');
$('#phone_number').attr('tabindex', '18');
$('#bank_name_chosen').attr('tabindex', '19');
$('#bank_branch_name_chosen').attr('tabindex', '20');
$('#bank_ac_number').attr('tabindex', '21');
$('#reenter_bank_ac_number').attr('tabindex', '22');
$('#ifsc_code').attr('tabindex', '23');
$('#aadhar_card_type').attr('tabindex', '24');
$('#aadhar_card_number').attr('tabindex', '25');
$('#mgnrega_number').attr('tabindex', '26');
$('#work_id').attr('tabindex', '27');
$('#work_coole_id').attr('tabindex', '28');
$('#is_labor_board_member').attr('tabindex', '29');
$('#house_ownership_id').attr('tabindex', '30');
$('#house_type_id').attr('tabindex', '31');
$('#total_number_of_family_memebers').attr('tabindex', '32');
$('#gender1').attr('tabindex', '33');
$('#education_id1').attr('tabindex', '34');
$('#gender1').attr('tabindex', '35');
$('#education_id1').attr('tabindex', '36');
$('#annual_income1').attr('tabindex', '37');
$('#is_tax_payer1').attr('tabindex', '38');
$('#member_name2').attr('tabindex', '39');
$('#relationship_id2').attr('tabindex', '40');
$('#mem_age2').attr('tabindex', '41');
$('#gender2').attr('tabindex', '42');
$('#education_id2').attr('tabindex', '43');

$('#member_name3').attr('tabindex', '44');
$('#relationship_id3').attr('tabindex', '45');
$('#mem_age3').attr('tabindex', '46');
$('#gender3').attr('tabindex', '47');
$('#education_id3').attr('tabindex', '48');

$('#member_name4').attr('tabindex', '49');
$('#relationship_id4').attr('tabindex', '50');
$('#mem_age4').attr('tabindex', '51');
$('#gender4').attr('tabindex', '52');
$('#education_id4').attr('tabindex', '53');

$('#member_name5').attr('tabindex', '54');
$('#relationship_id5').attr('tabindex', '55');
$('#mem_age5').attr('tabindex', '56');
$('#gender5').attr('tabindex', '57');
$('#education_id5').attr('tabindex', '58');

$('#member_name6').attr('tabindex', '59');
$('#relationship_id6').attr('tabindex', '60');
$('#mem_age6').attr('tabindex', '61');
$('#gender6').attr('tabindex', '62');
$('#education_id6').attr('tabindex', '63');

$('#member_name7').attr('tabindex', '64');
$('#relationship_id7').attr('tabindex', '65');
$('#mem_age7').attr('tabindex', '66');
$('#gender7').attr('tabindex', '67');
$('#education_id7').attr('tabindex', '68');


$('#individual_household_latrine').attr('tabindex', '69');
$('#id_shwfrm').attr('tabindex', '70');

$('#relationship_id2').attr('tabindex', '39');
$('#relationship_id2').attr('tabindex', '39');
$('#relationship_id2').attr('tabindex', '39');
$('#relationship_id2').attr('tabindex', '39');
$('#relationship_id2').attr('tabindex', '39');





    $('#work_id').val('1').change();
    $('#work_coole_id').val('14').change();

//     $('#house_ownership_id').val('2').change();
//     $('#house_type_id').val('1').change();

    $('#is_labor_board_member').val('N').change();
    $('#is_pensioner1').val('N').change();
    $('#is_pensioner2').val('N').change();
    $('#is_pensioner3').val('N').change();
    $('#is_pensioner4').val('N').change();
    $('#is_pensioner5').val('N').change();
    $('#is_pensioner6').val('N').change();
    $('#is_pensioner7').val('N').change();

    $('#is_tax_payer1').val('N').change();
    $('#is_tax_payer2').val('N').change();
    $('#is_tax_payer3').val('N').change();
    $('#is_tax_payer4').val('N').change();
    $('#is_tax_payer5').val('N').change();
    $('#is_tax_payer6').val('N').change();
    $('#is_tax_payer7').val('N').change();

    $('#is_business_taxpayer1').val('N').change();
    $('#is_business_taxpayer2').val('N').change();
    $('#is_business_taxpayer3').val('N').change();
    $('#is_business_taxpayer4').val('N').change();
    $('#is_business_taxpayer5').val('N').change();
    $('#is_business_taxpayer6').val('N').change();
    $('#is_business_taxpayer7').val('N').change();

    $('#is_selfhelp_group_member1').val('N').change();
    $('#is_selfhelp_group_member2').val('N').change();
    $('#is_selfhelp_group_member3').val('N').change();
    $('#is_selfhelp_group_member4').val('N').change();
    $('#is_selfhelp_group_member5').val('N').change();
    $('#is_selfhelp_group_member6').val('N').change();

    $('#annual_income2').val('0');
    $('#annual_income3').val('0');
    $('#annual_income4').val('0');
    $('#annual_income5').val('0');
    $('#annual_income6').val('0');
    $('#annual_income7').val('0');

    $('#individual_household_latrine').val('N').change();
//         $('#').val('1').change();
//         $('#').val('1').change();
//         $('#').val('1').change();
//         $('#').val('1').change();

    $(document).ready(function() {
    $("input, textarea").keyup(function() {
        var val = $(this).val();
        $(this).val(val.toUpperCase());
    });

    $('input[type="text"]').on('keypress', function() {
        var $this = $(this), value = $this.val();
        if (value.length === 1) {
            $this.val( value.charAt(0).toUpperCase());
        }
    });

});
//     var audioElement = document.createElement('audio');
// audioElement.setAttribute('src', 'https://www.soundjay.com/button/beep-08b.mp3');
// audioElement.play();

})();