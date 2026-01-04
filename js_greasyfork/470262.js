// ==UserScript==
// @name     MAHE Autofill Button for Derma
// @version  1.0
// @grant    none
// @match        http://172.16.7.74/DISCHSUM/DischargeEntry*
// @match        http://172.16.7.74/dischsum/DischargeEntry*
// @match        http://172.16.7.74/DISCHSUM/ModifyEntry*
// @match        http://172.16.7.74/dischsum/ModifyEntry*
// @namespace Aditij Dhamija
// @description Says so on the tin
// @downloadURL https://update.greasyfork.org/scripts/470262/MAHE%20Autofill%20Button%20for%20Derma.user.js
// @updateURL https://update.greasyfork.org/scripts/470262/MAHE%20Autofill%20Button%20for%20Derma.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const d = new Date();
  let month = months[d.getMonth()];
  var date = d.getDate()

  var titleDate = month + " " + date

  // Create the autofill button
  var button = document.createElement('button');
  button.innerHTML = 'Autofill';
  button.style.position = 'fixed';
  button.style.top = '10px';
  button.style.right = '10px';
  document.body.appendChild(button);

   function titleCase(str) {
   str = str.toLowerCase().split(' ');
   for (var i = 0; i < str.length; i++) {
       str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
   }
   return str.join(' ');
   }

  var name = document.getElementById('ctl00_ContentPlaceHolder1_txtptname');
  button.addEventListener('click', function() {
    var input1 = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
    var input2 = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
    var input3 = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
    var input4 = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
    var input5 = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
    var input6 = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
    var input7 = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
    var input8 = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
    var input9 = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
    var input10 = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
    var input11 = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
    var discharge = document.getElementById('ctl00_ContentPlaceHolder1_radiodischarge');
    var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
    var daycare = document.getElementById('ctl00_ContentPlaceHolder1_radioDaycare');
    discharge.checked = false;
    daycare.checked = true;
    radio.checked = true;
    var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
    var unit = document.getElementById('ctl00_Label2').textContent.replace('Unit : ', '');
    var investigate = document.getElementById('ctl00_ContentPlaceHolder1_txtinvestigate').value;
    var data = `SKIN BIOPSY
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions, local anesthesia was given with lignocaine (with adrenaline) (after a test dose). A 3.5 mm punch biopsy was taken from the representative lesion. Bleeding at biopsy site was controlled.  Patient tolerated the procedure well. Post procedure instructions like wound care and topical antibiotics were provided.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:
PAIN, BLEEDING, BLISTERING
SKIN OPD - 08202922276

INTRALESIONAL INJECTION
Procedural details were explained to the patient . written consent was taken . the rea of the procedure was cleaned under aseptic precautions. Intralesional injection of tricort (triamcinolone ) 40 mg/ml 1:1 dilution given.
patient tolerated procedure well and was observed for few hours for any discomfort or redness. patient is fit for discharge and is discharged with following advise : review sos bleeding , blistering.

PRP
Platelet rich plasma- Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions, 4 ml of Platelet rich plasma was injected over scalp at equidistant points. Patient tolerated the procedure well. Patient was observed for few hours for any discomfort or redness. Patient is fit for discharge and is discharged with the following advice: Review after 1 month in Skin OPD
HEADACHE, SYNCOPE, BLEEDING, BLISTERING
SKIN OPD - 08202922276

CHEMICAL PEELING
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions ____ peel was applied to the face and neutralized after __ minutes. Patient tolerated well. Post procedure instructions like gentle face wash, avoidance of topical medications for next 2 days, sunscreens and sun protection advice were provided.
Patient was observed for few hours for any discomfort or redness. Patient is fit for discharge and is discharged with the following advice:
PHOTOPROTECTION WITH SUNSCREEN
REVIEW SOS
Burning sensation, erythema, itching
SKIN OPD - 08202922276

COMEDONE EXTRACTION
PRP
PHOTOPROTECTION WITH SUNSCREEN
REVIEW SOS
Pain, erythema, blister formation
skin opd – 08202922276

KOH SCRAPING
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and the take a skin scraping, which they then place in a potassium hydroxide (KOH) solution and analyze under a microscope .Patient tolerated the procedure well.
PAS

CHEMICAL CAUTERY
Chemical cautery with 35% TCA was done.
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned. Petroleum jelly was applied to the surrounding normal skin, and then 35% Tri-chloro acetic acid was applied over the lesion. The development of white frosting was observed over the treated area. The patient tolerated the procedure well. Post procedure instructions like gentle face wash, avoidance of topical medications for next 2 days, sunscreens and sun protection advice were provided.
Patient was observed for few hours for any discomfort or redness. Patient is fit for discharge and is discharged with the following advice:
PHOTOPROTECTION WITH SUNSCREEN
REVIEW SOS
Burning sensation, erythema, itching
skin opd - 08202922276

ELECTROCAUTERY
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions, local anesthesia was given with lignocaine (with/without adrenaline) (after a test dose)/ topical anesthesia with eutectic mixture of lignocaine and prilocaine was used on the site. Hyfrecation of the lesion was started at the lowest settings and gradually increased till lesions were removed. Procedure site bleeding was controlled. Post procedure instructions like topical antibiotics and sun protection advice were provided.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:
Burning sensation, erythema, itching
skin opd - 08202922276

RADIOFREQUENCY CAUTERY
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions, local anesthesia was given with lignocaine (with/without adrenaline) (after a test dose)/ topical anesthesia with eutectic mixture of lignocaine and prilocaine was used on the site. Radiofrequency was started at the lowest settings at the cut/ coagulate mode and gradually increased till lesions were removed. Post procedure instructions like topical antibiotics and sun protection advice were provided.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:

CRYOTHERAPY:
Procedure details were explained to the patient. Written informed consent was taken.
The  patient was seated in a room with fan off. The affected area was soaked in water at room temperature for 10-15 minutes. Paring of the lesion was done. Cryospray with liquid nitrogen at -196* Celsius was administered to the lesions with long nozzle of suitable diameter.  2 sprays of 15 secs were given. White frosting was achieved on and 2 mm around the lesion. The patient tolerated the procedure well. Patient was counselled about chance for blistering or erosion, and was prescribed topical antibiotic cream.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice

PODOPHYLLIN APPLICATION
Procedure details were explained to the patient. Written informed consent was taken.
Patient was made to lie in supine position with legs flexed and apart. Genitalia was exposed. With a cotton swab , Vaseline was applied around the lesions taking care not to cover the edges of the lesion. Podophyllotoxin/Podophyllin in tincture benzoin was applied with blunt end of a tooth pick, only to the lesions. The patient lay for 10 minutes after procedure . The area was cleaned with soap and water after   6 hours.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:
To review after one week for re evaluation and repeat procedure.

LASER
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions.
DIODE LASER TREATMENT GIVEN.
Patient was observed for few hours for any discomfort, erythema. Patient is fit for discharge and is discharged with the following advice:
PHOTOTOPROTECTION WITH SUNSCREEN
ERYTHEMA, ITCHING, CRUSTING, BLISTERING
SKIN OPD- 08202922276

PHOTOTHERAPY BATH PUVA:
Procedure details were explained to the patient. Written informed consent was taken.
To 133 litres of water in the tub 50 ml 8-methoxypsoralen was  added so as to obtain a concentration of 3.75 ml per litre. The patient was asked to immerse  himself/herself  in the tub for 10 minutes in supine and 10 minutes in prone position. The patient was asked to gently agitate the water while soaking. After 20 minutes of soaking patient was asked to pat dry the skin and  immediately exposed to UVA in whole body phototherapy chamber. The eyes were protected using photo-protective glasses and genitals with undergarments.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice: Continue topical and oral medications, avoid intense direct sun exposure, to come for next treatment after 2 days.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

PHOTOTHERAPY HAND AND FEET:
Procedure details were explained to the patient. Written informed consent was taken.
To 4 litres of water in the tub 1.5 ml 8-methoxypsoralen was  added so as to obtain a concentration of 3.75 ml per litre. The patient was asked to immerse  hands and feet in the  for 10 mins. The patient was asked to gently agitate the water while soaking. After 20 minutes of soaking patient was asked to pat dry the skin and  immediately exposed to UVA in hand and foot UVA  therapy machine.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice: continue topical and oral medications, avoid intense direct sun exposure, to come for next treatment after 2 days.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

BATH PUVA- LOW DOSE LOW CONCENTRATION
Procedure details were explained to the patient. Written informed consent was taken.
To 100 liters of water in the tub 25 ml 8-methoxypsoralen was added so as to obtain a concentration of 2.5 ml per liter. . The patient immersed himself/herself  in the tub for 10 minutes in supine and 10 minutes in prone position. The patient was asked to gently agitate the water while soaking. After 20 minutes of soaking patient was asked to pat dry the skin and immediately exposed to UVA in whole body phototherapy chamber. The eyes were protected using photo-protective glasses and genitals with undergarments. After completion of treatment the patient was advised regarding avoiding excessive sun exposure for the rest of the day and the  next appointment was given.
Patient was observed for few hours for any discomfort or erythema.
Patient is fit for discharge and is discharged with the following advice:  : Continue topical and oral medications, avoid intense direct sun exposure, to come for next treatment after 2 days.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

SOAK PUVA
Procedure details were explained to the patient. Written informed consent was taken.
To 4 liters water in a plastic tub 2 ml of 8-methoxypsoralen was added to obtain a concentration of 3.75 mg per liter. The hands/feet  were dipped for 20 minutes.  Then  pat dried and  exposed to UVA in the hand and foot unit. After completion the patient was advised regarding further treatment and the next appointment. Patient is fit for discharge and is discharged with the following advice:   continue topical and oral medications, avoid intense direct sun exposure, to come for next treatment after 2 days.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

Turban PUVA
Patient was explained about the procedure. In 2 litres of water, 2ml melanocyl solution was added. Then a cloth was dipped in the solution and sqeezed and was tied around the head as turban for 5 mins, the cycle was repeated for 4 times. Then the affected area was exposed to UV light. Patient tolerated well and procedure was uneventful.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

NB UVB
Procedure details were explained to the patient. Written informed consent was taken.
The narrow band chamber was switched on for few minutes. The time for administering the   dose of NBUVB was  calculated using the chart and   entered in the chamber panel. The patient was asked to stand at the centre of the chamber on a wooden elevation. The required dose of NBUVB was administered. The eyes and genitals were protected. After completion of treatment the patient was advised regarding avoiding excessive sun exposure for the rest of the day and the  next appointment was given.
Patient was observed for few hours for any discomfort.
Patient is fit for discharge and is discharged with the following advice:
Continue topical and oral medications, avoid intense direct sun exposure, to come for next treatment after 2 days.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

Patch Test:
Procedure details were explained to the patient. Written informed consent was taken.
The upper back is shaved and cleaned. Patch testing was done by application of Finn chamber using the Indian Standard Series (ISS) of 20 antigens on either side of the spine over the upper back.
The patient was advised to minimise movement , avoid dislodging the patch test applied and readings taken on day 24, day 48, day 72.
The result was conveyed to the patient and further instructions given.
Patient is fit for discharge and is discharged with the following advice: avoid contact with……………………, continue topical and oral medication

PHOTO PATCH TEST:
Procedure details were explained to the patient. Written informed consent was taken.
The upper back is shaved and cleaned. Patch testing was done by application of Finn chamber using the Indian Standard Series (ISS) of 20 antigens in duplicate on either side of the spine over the upper back.
The patient  was advised to keep the area dry and avoid wetting the back.
After 24 h, the tapes were carefully removed and squares representing each chamber were marked using a marker pen. Readings were recorded after a gap of half an hour.
One side was then closed with an opaque black cloth and the other side was irradiated with 5-15 J/cmsq of UVA (?14).
A distance of 15 cm was kept between the patient's back and irradiation source.
Readings were then recorded after 48 h and 72 h.
After the procedure the patient was counselled regarding the result obtained.
Patient is fit for discharge and is discharged with the following advice: avoid sun exposure, exposure to …………….

Mini punch grafting for vitiligo:
Procedure details were explained to the patient. Written informed consent was taken.
He/she was counselled regarding the expected improvement and need for subsequent phototherapy, and the possible complications expected.
Under aseptic precautions, the area was infiltrated with local anesthetic.
Using a 2mm punch, recipient chambers were made very close to the border of the lesion at a distance of 0.5mm from each other.
The donor area (upper lateral portion of thigh or gluteal area) was painted and draped and punch impression were taken at close proximity to each other.
The grafts were placed directly from donor to the recipient areas.
Hemostasis was achieved.
Bactigras skin opd done.
Patient was counselled regarding care of graft and donor site and follow up after a week for removal of r and visualizing for graft take up.
Patient was observed for 24 hours for any discomfort, pain,  bleeding etc. Patient is fit for discharge and is discharged with the following advice: keep the area dry and to review after 7 days for removal of dressing

Nail avulsion: complete
Procedure details were explained to the patient. Written informed consent was taken.
The area was cleaned and draped.
Distal digital block given using plain lidocaine 2%
Digital tourniquet was applied at the base of finger/toe.
Spatula/septum elevator was introduced under the nail plate at the level of hyponychium and pushed toward lunula.
The instrument was withdrawn and reintroduced in the adjoining region till the entire area to be avulsed was separated.
The separated nail plate was grasped with a hemostat and avulsed by twisting the hemostat around its long axis.
Pressure was applied white untying the tourniquet and hemostasis is achieved.
Dressing was done.
Patient was observed for 24 hours for any discomfort, pain bleeding etc. Patient is fit for discharge and is discharged with the following advice:   keep the area dry and to review after 2 days for removal of dressing

Longitudinal partial nail plate avulsion:
Procedure details were explained to the patient. Written informed consent was taken.
The area was cleaned and draped.
Distal digital block given using plain lidocaine 2%
Digital tourniquet was applied at the base of finger/toe.
The part to be avulsed was split with a nail splitter till the distal most part of proximal nail fold.
Stevens’ scissor was introduced under the PNF with its blades closed.
The blades were opened and the part of nail plate under the PNF is sectioned.
The separated part of nail plate was grasped with a hemostat and avulsed by twisting the hemostat around its long axis.
Pressure was applied white untying the tourniquet and hemostasis achieved.
Dressing was done.
Patient was advised to keep the area dry and to review after 2 days for removal of dressing.
Patient was observed for 24 hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice: keep the area dry and to review after 2 days for removal of dressing

Nail Plate Biopsy:
Procedure details were explained to the patient. Written informed consent was taken.
The area was cleaned and draped.
Distal digital block given using plain lidocaine 2%
Digital tourniquet was applied at the base of finger/toe.
3-4 mm punch biopsy is taken from the nail plate.
Pressure is applied white untying the tourniquet and hemostasis is achieved.
Dressing is done.
Patient was advised to keep the area dry and to review after 2 days for removal of dressing.
Patient was observed for 24 hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice: keep the area dry and to review after 2 days for removal of dressing

Nail Bed Biopsy:
Procedure details were explained to the patient. Written informed consent was taken.
The area was cleaned and draped.
Distal digital block given using plain lidocaine 2%
Digital tourniquet was applied at the base of finger/toe.
Partial nail plate avulsion was performed.
A 3 mm punch was used to take the sample from the nail bed.
Pressure is applied white untying the tourniquet and hemostasis is achieved.
Dressing is done.
Patient was observed for 24 hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:
Patient was advised to keep the area dry and to review after 2 days for removal of dressing, and to review after 2 weeks for biopsy report and formulate further treatment plan

Nail Matrix Biopsy.
Procedure details were explained to the patient. Written informed consent was taken.
Under aseptic precautions, after administering digital block, exsanguination, and tourniquet, the proximal nail fold was cut through and retracted and held back with the help of skin hooks
A 3mm punch biopsy was taken.
The retracted proximal nail fold was sutured in place.
Hemostasis was achieved.
Dressing was done.
Patient was observed for 24 hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:
Patient was advised to keep the area dry and to review after 2 days for removal of dressing, and to review after 2 weeks for biopsy report and formulate further treatment plan

Chemical matrixectomy:
Procedure details were explained to the patient. Written informed consent was taken.
Under aseptic precautions, the nail matrix was exposed. 88% saturated liquid phenol was applied with help of cotton tipped tooth-pick for 1 minute over the nail matrix.
Patient tolerated the procedure well. Patient was observed for 24 hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:

SKIN SCRAPING AND KOH MOUNT
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned with alcohol swab and a 11 number blade was used to collect scales from the area and was transferred onto a glass slide. Around 2-3 drops of 10% KOH was poured over the scales and a cover slip was put on it. The slide was heated using a bunsen burner and then was viewed under the microscope to look for fungal hyphae. Patient tolerated the procedure well, no immediate post procedure complications seen and was advised to review in OPD with the report.

SLIT SKIN SMEAR
Procedure details were explained to the patient. Written informed consent was taken. The sites were first cleaned with ether. The site was pinched between thumb and forefinger to drive out blood, a slit of size 5mm long and 3mm depth was made using a 15 no. bard parker blade. The tissue fluid and pulp was collected and smeared onto the slide. The slide was covered with carbol fuchsin and heat was applied beneath it using bunsen burner so that steam rises from all parts of the slide and was left for 15 minutes without any further heating. Stain was tipped and slide was washed under gentle stream of water. Acid alcohol mixture was then applied, kept for 5 seconds and then was washed. This was followed by adding 1 % methylene blue on the slide for 30 seconds and then washing it. The slide was then viewed under the oil immersion microscope to look for any acid fast bacilli and bacteriological and morphological index was calculated accordingly. Patient tolerated the procedure well and was advised to review in OPD with the report.

PUS C/S
Procedure details were explained to the patient. Written informed consent was taken. The affected site was cleaned with normal saline first, then using 2 cotton swabs, 2 samples of pus were collected separately and was sent for culture. The patient was asked to review in skin OPD after the report.

SWAB FOR HSV PCR
Procedure details were explained to the patient. Written informed consent was taken. The affected site was cleaned with normal saline first, then using 2 cotton swabs, 2 samples were collected separately and was sent in appropriate medium (viral transport medium). The patient was asked to review in skin OPD after the report.

GRAM STAINING
Procedure details were explained to the patient. Written informed consent was taken. Sample was collected from the affected site and smeared onto a slide. Crystal violet stain was added over the slide and kept for 1 minute. Then gram’s iodine solution was added to the smear for 1 minute and washed off with water. A few drops of decolorizer was added and rinsed off with running water. Lastly the smear was counterstained with safranin solution for 1 minute, washed off with water, air dried and  viewed under oil immersion microscope. The patient was asked to review in skin OPD with the reports.

Tzanck smear
Procedure details were explained to the patient. Written informed consent was taken. The vesicle/bulla was gently deroofed and then the base of the lesion was scraped using a back of the scalpel blade. The sample was smeared onto a slide and air dried. Giemsa stain was poured over the slide. After 15 minutes, the slide was washed with sterile water and viewed under the microscope. The patient was asked to review in skin OPD with the reports.

Nail Clipping for KOH mount
Procedure details were explained to the patient. Written informed consent was taken. Affected nails were first cleaned with normal saline to remove contaminants and clipped short using standard nail clippers. Specimen was placed on a slide, and a drop of 20% KOH was added. A cover slip was applied with gentle pressure to drain away excess KOH and heated over a Bunsen burner. Incubation was done for 2 h or more (up to 48 h) until softening or digestion of the specimen occurred. Slides were microscopically evaluated to look for fungal elements. The patient was asked to review in skin OPD with the reports.

PRF Dressing
Procedure details were explained to the patient. Written informed consent was taken after which the lesion was cleaned with betadine and normal saline. PRF prepared under sterile condition using standard parameters was taken and made into smaller pieces which were laid over the wound. A dressing was done with gauze and a roller gauze. Patient tolerated the procedure well and was advised to come back for the next dressing after 1 week.

Cleaning and Betadine Dressing
Procedure details were explained to the patient. Written informed consent was taken after which the lesion was cleaned with normal saline followed by betadine. An antibiotic ointment was applied and a dressing using gauze and roller gauze was done. Patient tolerated the procedure well and was advised to come back for the next dressing.

Biologics injection
Procedure details were explained to the patient. Written informed consent was taken. The injection was taken out of the refrigerator and kept at room temperature for 30 min. The injection site was cleaned with alcohol swab and under aseptic precautions, Subcutaneous Injection of --------- was given.
Patient was observed for next 2 hours for any side effects. Patient tolerated the procedure well and vitals were stable following the injection. Patient is being discharged with the following advice.
    `
    const table = data.split('\n\n')
    function findMostMatches(inputString, stringArray) {
        var lines = inputString.split("\n");
        var bestMatch = "";

        for (var k = 0; k < lines.length; k++) {
            var line = lines[k];
            var inputWords = line.split(" ");
            var maxMatches = 0;
            var output = ''
            for (var i = 0; i < stringArray.length; i++) {
                var matchCount = 0;
                for (var j = 0; j < inputWords.length; j++) {
                    if (stringArray[i].toLowerCase().includes(inputWords[j].toLowerCase())) {
                        matchCount++;
                    }
                }
                if (matchCount > maxMatches) {
                    maxMatches = matchCount;
                    bestMatch = stringArray[i];
                }
            }
        output += bestMatch;

        }
        return output;
    }



    var therapy = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
    if (therapy.value == ''){
        if (investigate == ''){
            var invest = document.getElementById('ctl00_ContentPlaceHolder1_txtinvestigate')
            invest.value = 'Please enter investigative procedures to obtain therapeutic procedure details directly. Make sure to put separate procedures in different lines to get details for both at once. Clear this prompt out and try it now!';
        }else{
            var investigations = investigate.split('\n');
            for (var i = 0; i < investigations.length; i++) {
                var result = findMostMatches(investigations[i], table);
                therapy.value += result + '\n';
            }
        }
    }

    if (input3.value == '') {
      input3.value = 'NA';
    }
    if (input4.value == '') {
      input4.value = 'SKIN OPD - 08202922276';
    }
    if (unit == 'SKN001') {
      input5.value = 'DR. SATHISH PAI';
      input6.value = 'PROFESSOR AND HOU';
      input7.value = 'DERMATOLOGY UNIT 1';
      select.selectedIndex = 2;
    }
    if (unit == 'SKN002') {
      input5.value = 'DR. RAGHAVENDRA RAO';
      input6.value = 'PROFESSOR AND HOD';
      input7.value = 'DERMATOLOGY UNIT 2';
      select.selectedIndex = 1;
    }
    if (input11.value == ''){
      input11.value = 'Stable';
    }
    var search = '[title="DATE"]'.replace('DATE', titleDate)
    var node = document.querySelector(search);
    node.click()
  });


   function preventclose(){window.addEventListener("beforeunload", function(event){
   var confirmationMessage = "You are not allowed to close this window"
   event.returnValue = confirmationMessage
   if (typeof event.preventDefault === "function"){
       event.preventDefault();
  }
  return confirmationMessage
  });
                          }

    function createRadioButton(id, label) {
        var radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.id = id;
        radioButton.name = 'radioGroup';
        radioButton.value = label;

        var radioLabel = document.createElement('label');
        radioLabel.htmlFor = id;
        radioLabel.appendChild(document.createTextNode(label));

        var radioContainer = document.createElement('div');
        radioContainer.appendChild(radioButton);
        radioContainer.appendChild(radioLabel);

        return radioContainer;
    }

    // Create the radio buttons
    var radioContainer1 = createRadioButton('radioButton1', 'Show error when changing window');

    // Add the radio buttons to the document
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '98%';
    container.style.right = '10px';
    container.style.transform = 'translateY(-50%)';
    container.appendChild(radioContainer1);
    document.body.appendChild(container);
    radioButton1.addEventListener('change', preventclose);


})();
