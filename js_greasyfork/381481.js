// ==UserScript==
// @name         identogo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Form Filling
// @author       author name
// @match        https://uenroll.identogo.com/workflows/11FT12/hardcard/bio
// @match        https://uenroll.identogo.com/workflows/11FT12/hardcard/citizenship
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/0.8.3/jquery.csv.js
// @resource     csvFile file://C:\morpho export.csv
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/381481/identogo.user.js
// @updateURL https://update.greasyfork.org/scripts/381481/identogo.meta.js
// ==/UserScript==

$(window).ready(function($) {
   var file = GM_getResourceText('csvFile');
   var csv = $.csv.toArrays(file);
   var row = 0;

    //var interval = setInterval(fillFormInterval, 3000);
  var scope = angular.element($('body')).scope();
   // scope.$on('$includeContentLoaded', function(){
            // fillForm(csv[row]);
     //   setTimeout(fillForm(csv[row]));
    //});
    var interval = setInterval(fillFormInterval, 1000);
    function fillFormInterval() {
        if($('#applicant-preferredCommunicationMethod').length) {
            clearInterval(interval);
            setTimeout(function() {
                fillForm(csv[row]);
            },3000);
        }

    }

    function fillForm(tempRow) {
        var scope = angular.element($('#applicant-firstName')).scope();
        if(!scope.applicant || !scope.applicant.phone1) {
             return;
        }
        var row = new Array(5).fill(undefined);
        row[1] = "NMN";
        tempRow.forEach(function(data,i) {
            if(data != '') {
                row[i] = data;
            }
        });
        scope.$apply(function() {
            scope.applicant.firstName = row[0];
            scope.applicant.middleName = row[1];
            scope.applicant.lastName = row[2];
            scope.applicant.dateOfBirth = row[3];
            scope.applicant.dateOfBirth2 = row[3];
            scope.applicant.phone1.number = row[4];
            scope.applicant.preferredCommunicationMethod = "PHONE1";
            scope.inherited.next();
        });
        //scope.applicant.countryOfBirth = "CD";
    }
    
    var interval_2 = setInterval(fillFormInterval_2, 1000);
    function fillFormInterval_2() {
        if($('#applicant-countryOfBirth').length) {
            clearInterval(interval_2);
            setTimeout(function() {
                fillForm_2(csv[row]);
            },3000);
        }

    }

    function dropDownVal(id, text) {
        var value = null;
        $(id).each(function() {
            if(this.text.toLowerCase() == text) {
                value = this.value;
                value = value.split(':');
                if(value.length > 1) { 
                    value = value[1];
                }else {
                    value = value[0];
                }
            }
        });
        return value;
    }
    function fillForm_2(data) {
        var scope = angular.element($('#applicant-countryOfBirth')).scope();
        var country = '';
        country = dropDownVal('#applicant-countryOfBirth option', data[5].toLowerCase());
        //scope.applicant.countryOfBirth = country;
        var state = null;
        scope.$apply(function() {
            scope.applicant.countryOfBirth = country;
            scope.updateStateProvince(scope.applicant.countryOfBirth);
            setTimeout(function() {
                if(country == "US" || country == "CD" || country == "MM") {
                    state = dropDownVal('#applicant-stateProvinceOfBirth option', data[6].toLowerCase());
                }
                var citizen = dropDownVal('#applicant-countryOfCitizenship option', data[7].toLowerCase());
                console.log(country + " " + state + " " + citizen);
                scope.applicant.countryOfCitizenship = citizen;
                scope.applicant.stateProvinceOfBirth = state;
                scope.$apply();
                scope.inherited.next();
            });
        });
    }
    
    var interval_3 = setInterval(fillFormInterval_3, 1000);
    function fillFormInterval_3() {
        if($('.personal-questions').length) {
            clearInterval(interval_3);
            setTimeout(function() {
                fillForm_3(csv[row]);
            },3000);
        }
    }

    function fillForm_3(data) {
        var scope = angular.element($('ue-radio-btns')).scope();
        scope.$apply(function() {
           scope.applicant.hasMaidenPreviousName = false;
           scope.applicant.hasAliasName = false;
           scope.applicant.hasSameMailingResidentialAddress = true;
           scope.applicant.doYouHaveAuthCode = false;
           scope.applicant.viewEcNearYou = false;
           scope.inherited.next();
        });
    }
    
    var interval_4 = setInterval(fillFormInterval_4, 1000);
    function fillFormInterval_4() {
        if($('#ue-btn-US').length) {
            clearInterval(interval_4);
            setTimeout(function() {
                fillForm_4(csv[row]);
            },3000);
        }
    }

    function fillForm_4(data) {
        var scope = angular.element($('#applicant-eyeColor')).scope();

        scope.$apply(function() {
            scope.heightFt = parseInt(data[8].substr(0,1));
            scope.heightIn = parseInt(data[8].substr(1,3));
            scope.weightLb = parseInt(data[9]);
            scope.applicant.hairColor = dropDownVal('#applicant-hairColor option', data[10].toLowerCase());
            scope.applicant.eyeColor = dropDownVal('#applicant-eyeColor option', data[11].toLowerCase());
            scope.applicant.gender = dropDownVal('#applicant-gender option', data[12].toLowerCase());
            if(data[13].toLowerCase() == 'mixed') {
                 data[13] = 'Unknown';
            }else if(data[13].toLowerCase() == 'white' || data[13].toLowerCase() == 'hispanic') {
                 data[13] = 'Caucasian/Latino';   
            }
            scope.applicant.race = dropDownVal('#applicant-race option', data[13].toLowerCase());
            scope.inherited.next();
        });
    }
    
    var interval_5 = setInterval(fillFormInterval_5, 1000);
    function fillFormInterval_5() {
        if($('#applicant-mailingAddress-country').length) {
            clearInterval(interval_5);
            setTimeout(function() {
                fillForm_5(csv[row]);
            },3000);
        }
    }

    function fillForm_5(data) {
        var scope = angular.element($('#applicant-mailingAddress-country')).scope();
        
        scope.$apply(function() {
            scope.applicant.mailingAddress = {};
            scope.applicant.mailingAddress.country = "US";
            scope.updateStates('mailingAddress');
            scope.applicant.mailingAddress.addressLine1 = data[14];
            scope.applicant.mailingAddress.addressLine2 = data[15];
            scope.applicant.mailingAddress.city = data[16];
            setTimeout(function() {
                scope.$apply(function() {
                    scope.applicant.mailingAddress.state = dropDownVal('#applicant-mailingAddress-state option', data[17].toLowerCase());
                    scope.applicant.mailingAddress.postalCode = data[18];
                    scope.inherited.next();
                });
            });
            //scope.inherited.next();
        });
    }

    var interval_6 = setInterval(fillFormInterval_6, 1000);
    function fillFormInterval_6() {
        if($('#designatedRecipient-name').length) {
            clearInterval(interval_6);
            setTimeout(function() {
                fillForm_6(csv[row]);
            },3000);
        }
    }

    function fillForm_6(data) {
        var scope = angular.element($('#designatedRecipient-name')).scope();

        scope.$apply(function() {
             scope.applicant.designatedRecipientName = "Bioverify, Inc";
             scope.applicant.designatedRecipientAddress = {};
             scope.applicant.designatedRecipientAddress.country = "US";
             scope.applicant.designatedRecipientAddress.addressLine1 = "2535 Manana Drive";
             scope.applicant.designatedRecipientAddress.city = "Dallas";
            
             setTimeout(function() {
                scope.$apply(function() {
                   scope.applicant.designatedRecipientAddress.state = dropDownVal('#applicant-designatedRecipientAddress-state option', 'texas');
                   scope.applicant.designatedRecipientAddress.postalCode = "75220";
                    scope.inherited.next();
                });
             });
             scope.updateStates();
        });
    }
    
    var interval_7 = setInterval(fillFormInterval_7, 1000);
    function fillFormInterval_7() {
        if($('#payment-nameOnCard').length) {
            clearInterval(interval_7);
            setTimeout(function() {
                fillForm_7(csv[row]);
            },3000);
        }
    }

    function fillForm_7(data) {
        var scope = angular.element($('#payment-nameOnCard')).scope();

        scope.$apply(function() {
            scope.applicant.payment.nameOnCard = "NAME";
            scope.applicant.payment.cardNumber = "CC NUMBER";
            scope.applicant.payment.expiration = {};
            scope.applicant.payment.expiration.month = 10;
            scope.applicant.payment.expiration.year = "15";
            scope.applicant.payment.csc = "355";
            
        });
    }


});
