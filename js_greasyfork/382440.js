// ==UserScript==
// @name         RS-to-ShipStation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sending RepairShopr data to shipstation.
// @author       Gundilashvili
// @match        *.repairshopr.com/tickets/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382440/RS-to-ShipStation.user.js
// @updateURL https://update.greasyfork.org/scripts/382440/RS-to-ShipStation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.jQuery;
    $(document).ready(function() {

            //configure shipstation store data
            const storeConfig = {
                //API Key and Secret Key can be found in:
                //Account Settings > Account > API Settings > Generate API keys.
                //StoreID can be found in:
                //Account Settings > Selling Channels > Store setup > Edit store > last numbers in page link: /stores/...
                 APIKEY: '',
                 SECRETKEY: '',
                 STOREID: ''
            }

             // Defining variables for data to send
            let ticketNumber,
                ticketSubject,
                order = {
                    number: '',
                    subject: '',
                    customerDetails: { }
                }

            // handle send func, call to gatherData() and sendData() func,
            const handleSendToShipstation = () => {
               if(!storeConfig.APIKEY || !storeConfig.SECRETKEY || !storeConfig.STOREID){
                   alert('APIKEY, SECRETKEY or STOREID is not provided')
               }else {
                      getData()
                      sendData()
               }
            }

            // creating Button to send data and adding handler for it
            const btnSendToShipstation = '<a class="btn btn-default btn-sm" id="btnSendToShipstation" href="#">Send to Shipstation </a>'
            $('.btn-group').first().append(btnSendToShipstation)
            $( "#btnSendToShipstation" ).on( "click", handleSendToShipstation )

            // main function wich gets and sets required data
            const getData = () => {
               $("#btnSendToShipstation").text('Sending...');
               // Update ticket number
               ticketNumber = $(".main .main-inner .container .row .col-md-12 .row .col-md-4 h1").text()
               // removing # from ticket number
               //ticketNumber.charAt(0) === '#' ? ticketNumber = ticketNumber.substr(1) : ticketNumber
               order.number = ticketNumber
               // Update ticket subject
               ticketSubject = $(".main .main-inner .container .row .col-md-12 .row.mts.mbm .col-sm-12 h3").text()
               order.subject = ticketSubject

               // finding Tbody of Customer info table
               let customerInfoTbody = $(".main .main-inner .container .row .col-md-12 .row .col-md-4  .widget.borderless.overflowable:not(:nth-child(1)) .widget-content .table > tbody  ").html()
               $(customerInfoTbody+' tr').each(function() {
                        let $this = $(this)
                        // Checking each <tr> > <td> elements to gather correct data
                        switch($this.find('.cell-align-top:not(:nth-child(1))').text().replace(/\s/g, "").toLowerCase()) {
                            case 'customer':
                                order.customerDetails.name = $(this).children("td").children("span").text().trim().toString()
                              break
                            case 'email':
                                order.customerDetails.email = $(this).children("td").children("span").text().trim().toString()
                              break
                            case 'mobile':
                                order.customerDetails.mobile = $(this).children("td").children("span").text().trim().toString()
                                 break
                            case 'primaryaddress':
                                order.customerDetails.address = $(this).children("td").children("span").text().trim().toString()
                                break
                            default:
                              console.log('No matches for Customer Details...')
                          }
                      })
            }
            const sendData = () => {
                // defining request
                const date = new Date();
                const currentDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
                const request = new XMLHttpRequest();
                const url = 'https://ssapi.shipstation.com/orders/createorder';

                var body = {

                    'orderNumber': order.number,
                    'orderKey': order.number,
                    'orderDate': currentDate.toString(),
                    'paymentDate': '',
                    'shipByDate': '',
                    'orderStatus': 'awaiting_shipment',
                    'customerId': 0,
                    'customerUsername': order.customerDetails.name,
                    'customerEmail': order.customerDetails.email,
                    'billTo': {
                        'name': '',
                        'company': null,
                        'street1': null,
                        'street2': null,
                        'street3': null,
                        'city': null,
                        'state': null,
                        'postalCode': null,
                        'country': null,
                        'phone': null,
                        'residential': null
                    },
                    'shipTo': {
                        'name':  order.number,
                        'company': '',
                        'street1': order.customerDetails.address,
                        'street2': '',
                        'street3': null,
                        'city': '',
                        'state': '',
                        'postalCode': '',
                        'country': '',
                        'phone': order.customerDetails.mobile,
                        'residential': true
                    },
                    'advancedOptions': {
                        'warehouseId': 0,
                        'nonMachinable': false,
                        'saturdayDelivery': false,
                        'containsAlcohol': false,
                        'mergedOrSplit': false,
                        'mergedIds': [],
                        'parentId': null,
                        'storeId': storeConfig.STOREID,
                        'customField1': order.number ,
                        'customField2': order.subject,
                        'customField3': '',
                        'source': 'Webstore',
                        'billToParty': null,
                        'billToAccount': null,
                        'billToPostalCode': null,
                        'billToCountryCode': null
                    },
                    'tagIds': [
                        53974
                    ]
                }
                if(request)
                {
                    //update button text to make sure data is sending
                    setTimeout(function(){
                        $("#btnSendToShipstation").html('<i class="fas fa-check"></i>&nbsp; Sent.');
                    }, 1000);
                    request.open('POST', url, true);
                    request.setRequestHeader('X-PINGOTHER', 'pingpong');
                    request.setRequestHeader('Content-Type', 'application/json');
                    request.setRequestHeader('Authorization', `Basic ${btoa(storeConfig.APIKEY+':'+storeConfig.SECRETKEY)}`)

                    request.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            console.log('Status:', this.status);
                            console.log('Headers:', this.getAllResponseHeaders());
                            console.log('Response received with status',this.status)
                            const res = JSON.parse(this.responseText)
                            console.log(res[Object.keys(res)[0]])
                            document.getElementById('comment_body').innerHTML = `Shipment order created: ${res[Object.keys(res)[1]]} `
                        };
                    };
                    request.send(JSON.stringify(body));
                }
                //update button text to make sure data is sending
                 setTimeout(function(){
                   $("#btnSendToShipstation").html('Send To Shipstation');
                }, 3000);

            }
    });

})();



