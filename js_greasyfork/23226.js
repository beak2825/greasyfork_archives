// ==UserScript==
// @name        x-kom autoCheckout
// @namespace   xkomAutoCheckout
// @description Automatycznie wypełnia formularz zamówienia
// @include     http*://*.x-kom.*/zamowienie*
// @include     http*://*.eeepad.pl/zamowienie*
// @include     http*://*.al.to/zamowienie*
// @include     http*://*.alto.*/zamowienie*
// @include     http*://*.alto.eeepad.pl/zamowienie*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23226/x-kom%20autoCheckout.user.js
// @updateURL https://update.greasyfork.org/scripts/23226/x-kom%20autoCheckout.meta.js
// ==/UserScript==


ctrlCounter = 0;


// Każda aktualizacja przywraca dane domyślne!
var formData = {
    // Dane klienta
    'customerFirstName' : 'ImięDoOdbioru',  // Imię
    'customerLastName' : 'NazwiskoDoOdbioru',  // Nazwisko
    'customerEmail' : 'mail@doOdbioru.wp.pl',  // Adres mail
    'customerStreet' : 'Adres Do Odbioru',  // Adres
    'customerPostcode' : '11-111',  // Kod pocztowy
    'customerCity' : 'MiejscowośćDoOdbioru',  // Miejscowość
    'customerPhone' : '111111111',  // Numer telefonu
    
    // Inne dane do wysyłki
    'shipmentName' : 'Nazwa Do Wysyłki',  // Imię i nazwisko / Nazwa firmy
    'shipmentStreet' : 'Adres Do Wysyłki',  // Adres
    'shipmentPostcode' : '22-222',  // Kod pocztowy
    'shipmentCity' : 'MiejscowośćDoOdbioru',  // Miejscowość
    'shipmentPhone' : '222222222',  // Numer telefonu
    
    // Inne dane do faktury
    'invoiceName' : 'Nazwa Do Faktury',  // Imię i nazwisko / Nazwa firmy
    'invoiceStreet' : 'Adres Do Faktury',  // Adres
    'invoicePostcode' : '33-333',  // Kod pocztowy
    'invoiceCity' : 'MiejscowośćDoFaktury',  // Miejscowość
    'invoiceNip' : '3333333333',  // NIP
    
    // Uwagi do zamówienia
    'additionalNotes' : 'To są uwagi do zamówienia... Proszę narysować psa w zbroi!'
}


document.addEventListener('keyup', function(event) {
    if (event.key !== 'Control' && event.keyCode !== 17) return false;
        
    if (ctrlCounter++ === 1) {
       delivery   = $('#checkoutViewSection').find('.checkout-step:eq(0)').find('input:radio:checked').val();
       if (delivery === 'undefined') { alert('Wybierz metodę dostawy!'); }
        
       payment   = $('#checkoutViewSection').find('.checkout-step:eq(1)').find('input:radio:checked').val();
       if (payment === 'undefined') { alert('Wybierz metodę płatności!'); }
       
       if (delivery === '3' || delivery == '4') {
          withOther     = confirm('Czy wypełnić inne dane do wysyłki?');
       } else {
          withOther = false;
       }
       withInvoice   = confirm('Czy wypełnić inne dane do faktury?');
        
       autoFill(parseInt(delivery), parseInt(payment), withOther, withInvoice);
    };
    setTimeout(function() { ctrlCounter = 0; }, 500);
});


getDeliveryID = function (delivery) {
    delivery = delivery.toLowerCase();
    switch(delivery) {
        case '1':
        case 'osobisty':
        case 'salon':
            return 1;
            
        case '2':
        case 'inpost':
        case 'paczkomat':
        case 'paczkomaty':
            return 2;
            
        case '3':
        case 'kurier':
            return 3;
            
        case '4':
        case 'list':
        case 'list inpost':
            return 4;
            
        default:
            return 0;
    } 
}


getPaymentID = function (payment) {
    payment = payment.toLowerCase();
    switch(payment) {
        case '1':
        case 'przelew':
            return 1;
            
        case '2':
        case 'gotówka salon':
        case 'gotówka w salonie':
        case 'gotowka salon':
        case 'gotowka w salonie':
            return 5;
            
        case '3':
        case 'paypal':
            return 3;
            
        case '4':
        case 'karta salon':
        case 'karta w salonie':
            return 4;
            
        case '5':
        case 'gotówka odbiór':
        case 'gotówka kurier':
        case 'gotówka przy odbiorze':
        case 'gotowka odbior':
        case 'gotowka kurier':
        case 'gotowka przy odbiorze':
            return 5;
            
        case '6':
        case 'raty ca':
        case 'ca':
        case 'raty credit agricole':
        case 'credit agricole':
            return 6;
            
        case '7':
        case 'raty santander':
        case 'santander':
            return 7;
            
        case '8':
        case 'leasing':
            return 8;
            
        case '10':
        case 'karta inpost':
        case 'karta paczkomat':
        case 'karta w paczkomacie':
            return 10;
            
        case '11':
        case 'dotpay':
            return 11;
            
        default:
            return 0;
    } 
}


autoFill = function (delivery, payment, withOther, withInvoice) {
    if (typeof withOther === 'undefined') withOther = true;
    
    $('#deliveryMethod' + delivery).trigger('click').change();
    $('#paymentMethod' + payment).trigger('click').change();
    
    if (payment === 7) {
        $('input[name=isInstalmentFirstPay]').trigger('click');
        $('input[name=instalmentFirstPayType]:eq(0)').trigger('click');
        $('input[name=zagielAccept]').trigger('click');
    }
    
    if (delivery === 1) {
        currentTitle = $('#storeDepartment').find('option:eq(1)').prop('selected', true).end().trigger('change').find('option:eq(1)').text()
        $('#storeDepartment').closest('div').find('.selectable-container .selected-item.multiselect').prop('title', currentTitle).find('span').text(currentTitle)
    }
    
    if (delivery === 2) {
        $('#inpostProvince').find('option:eq(1)').prop('selected', true).end().change();
        $(document).ajaxComplete(function( event, xhr, settings ) {
            if (settings.url === "/inpost/fetch-cities/dolnoslaskie") {
                $('#inpostCity').find('option:eq(1)').prop('selected', true).end().change();
                
            } else if (settings.url === "/inpost/fetch-packstations/bielawa") {
                $('#inpostPackstationCode').find('option:eq(1)').prop('selected', true).end().change();
            }
            
        });
        
        $('#inpostPhoneNumber').val('111111111').trigger('change').trigger('blur');
    }
    
    $('#customerFirstName').val(formData.customerFirstName).trigger('change').trigger('blur');
    $('#customerLastName').val(formData.customerLastName).trigger('change').trigger('blur');
    $('#customerEmail').val(formData.customerEmail).trigger('change').trigger('blur');
    
    if (delivery === 2 || delivery === 3 || delivery === 4) {
        $('#customerStreet').val(formData.customerStreet).trigger('change').trigger('blur');
        $('#customerPostcode').val(formData.customerPostcode).trigger('change').trigger('blur');
        $('#customerCity').val(formData.customerCity).trigger('change').trigger('blur');
    }
    
    $('#customerPhone').val(formData.customerPhone).trigger('change').trigger('blur');

    if (withOther) {
        if(! $('input[name=otherShipmentAddress]').prop('checked')) $('input[name=otherShipmentAddress]').trigger('click');
        $('#shipmentName').val(formData.shipmentName).trigger('change').trigger('blur');
        $('#shipmentStreet').val(formData.shipmentStreet).trigger('change').trigger('blur');
        $('#shipmentPostcode').val(formData.shipmentPostcode).trigger('change').trigger('blur');
        $('#shipmentCity').val(formData.shipmentCity).trigger('change').trigger('blur');
        $('#shipmentPhone').val(formData.shipmentPhone).trigger('change').trigger('blur');
    }

    if (withInvoice) {
        if(! $('input[name=otherInvoiceData]').prop('checked')) $('input[name=otherInvoiceData]').trigger('click');
        $('#invoiceName').val(formData.invoiceName).trigger('change').trigger('blur');
        $('#invoiceStreet').val(formData.invoiceStreet).trigger('change').trigger('blur');
        $('#invoicePostcode').val(formData.invoicePostcode).trigger('change').trigger('blur');
        $('#invoiceCity').val(formData.invoiceCity).trigger('change').trigger('blur');
        $('#invoiceNip').val(formData.invoiceNip).trigger('change').trigger('blur');
    }
    
    if(! $('input[name=wantsAdditionalNotes]').prop('checked')) $('input[name=wantsAdditionalNotes]').trigger('click');
    $('textarea[name=additionalNotes]').val(formData.additionalNotes).trigger('change').trigger('blur');

    if(! $('input[name=termsOfUseAcceptation]').prop('checked')) $('input[name=termsOfUseAcceptation]').trigger('click');
    if(! $('input[name=privacyPolicyAcceptation]').prop('checked')) $('input[name=privacyPolicyAcceptation]').trigger('click');
}