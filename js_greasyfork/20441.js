// ==UserScript==
// @name                this is a test 08-a
// @author              test001
// @version             1.1
// @description         test
// @include             https://www.mturk.com/mturk/findhits*
// @include             https://www.mturk.com/mturk/preview*
// @include             https://www.mturk.com/mturk/searchbar*
// @include             https://www.mturk.com/mturk/sorthits*
// @include             https://www.mturk.com/mturk/sortsearchbar*
// @include             https://www.mturk.com/mturk/viewhits*
// @include             https://www.mturk.com/mturk/viewsearchbar*
// @namespace           jhakjfh
// @downloadURL https://update.greasyfork.org/scripts/20441/this%20is%20a%20test%2008-a.user.js
// @updateURL https://update.greasyfork.org/scripts/20441/this%20is%20a%20test%2008-a.meta.js
// ==/UserScript==
/*
myT1 = window.setTimeout(document.location.reload(), 10000);
myT2 = window.setInterval(document.loction.reload(), 10000);

document.addEventListener("DOMContentLoaded",myT1,false);


http://www.w3schools.com/jsref/met_win_settimeout.asp
var t4;
function t5(){
    t4 = window.setTimeout(document.location.reload(), 10000);
}

document.addEventListener("DOMContentLoaded",t5,false);




*/



var previewLinkEls = document.querySelectorAll('span.capsulelink a');

for (var i = 0; i < previewLinkEls.length; i++) {
    var previewLink = previewLinkEls[i].getAttribute('href');

    if (previewLink && previewLink.split('?')) {
        var previewLinkArray = previewLink.split('?');
        if (previewLinkArray[0] == '/mturk/preview') {
            var previewAndAcceptLink = previewLinkArray[0] + 'andaccept?' + previewLinkArray[1] + '&autoAcceptEnabled=true';

            var previewAndAcceptEl = document.createElement('a');
            previewAndAcceptEl.setAttribute('href', previewAndAcceptLink);
            previewAndAcceptEl.setAttribute('target', 'mturkhits');
            previewAndAcceptEl.setAttribute('style', 'margin-right: 20px;');
            //previewAndAcceptEl.innerHTML = 'Preview & Accept HITs';
            previewAndAcceptEl.innerHTML = previewLink;

            var parentSpan = previewLinkEls[i].parentNode;
            parentSpan.insertBefore(previewAndAcceptEl, parentSpan.firstChild);
            
            // for $1:
          // var test1 = ["37ZHE2JT1D250TKIB56TICN73UQ88W", "3USMLONC9E5MDB1GD7ZQ6SDG14K85P"];
          //var test1 = ["37A2SHHJCAA4OEZURNW2APNCWINKJO", "32SOQFN7RN69ANCE3SJXXLOE49KIPK", "3RC5MYEBOEUTUWQQMTE7RXC3MYDPTF", "3HCACVK2ZBAIHHQXZB9ZROGP1J064M", "3XIFEF0YSRPO5FNSPQZPHGWQLADTWY", "30EWMN5823F6V067NMY50RQMKXZ47C", "33LV6TSG7A9WZGNVP1SUETIK8WJVQP", "3Q4JQOQUBRJ5E1P3X8LDXKYFZVKVM1", "34YHZZ9RB3TBW3O4TYQ1YX4MCYS5EV", "3I6C7P7ITDOXKLK5OF10KLHUCGH6ZL", "30LCVOSIGYZXFVA0STZH6E8S6MD6YU", "30LCVOSIGYZXFVA0STZH6E8S6MA6YR", "30LCVOSIGYZXFVA0STZH6E8S6LF6YU", "3HCACVK20CNHHOWG3MBAQP4LBKH64A", "38VQ1AW9T5R7EAHTZ8SMXA7NR7J62E", "35DNGIKWSGNJTPD2ZEX0Y5XEUCJ71R", "3SKITTYV05YWZSDC386RGKCFXLJ63P", "3GBCJUK5B11E755LSLD34C2Q6V7PKM", "3PYK988VEHLTI5LLVXTWEDRVY6S9XH", "36R3RQSDQUGJM0SK3VT0K0E4PKI70T", "3K8YRYAXTNY2H1YHU8XXDEXSRQ6DGP", "3SI493PTSWQ3S4N0UHF6QGKVRIHDZF", "3IJ5583D9EWBIPVAMIDYQZZU9NWE0E", "3WRXIMH6E1E5X224PNCJ7U84KKDL4A"];
         //var test1 = ["31ZOAI992IB8KKRVGW7EQ3WO6Y6TL2", "3V6FYJLHFQP5ZP8IBRCSNFCCOGC500", "3QXBZN23LGAR56OHOAGLSK63C8HXNK", "36E5WSNG6I17T0B7CYLCNJ8AUFL4S9", "3K3X4GGOTM42HH577AKI5JY61OXCMC", "3J06FGISLUWDJC6BIPDEWSVMFEK5KQ", "3HRZ3G9ES0H29PC2S86JQYDF67N9GH", "3PDVB95OTBHZ8YUWRI30K4E1PDQIHZ", "37A2SHHJCAA4OEZURNW2APNCWINKJO", "32SOQFN7RN69ANCE3SJXXLOE49KIPK", "3RC5MYEBOEUTUWQQMTE7RXC3MYDPTF", "3HCACVK2ZBAIHHQXZB9ZROGP1J064M", "3XIFEF0YSRPO5FNSPQZPHGWQLADTWY", "30EWMN5823F6V067NMY50RQMKXZ47C", "33LV6TSG7A9WZGNVP1SUETIK8WJVQP", "3Q4JQOQUBRJ5E1P3X8LDXKYFZVKVM1", "34YHZZ9RB3TBW3O4TYQ1YX4MCYS5EV", "3I6C7P7ITDOXKLK5OF10KLHUCGH6ZL", "30LCVOSIGYZXFVA0STZH6E8S6MD6YU", "30LCVOSIGYZXFVA0STZH6E8S6MA6YR", "30LCVOSIGYZXFVA0STZH6E8S6LF6YU", "3HCACVK20CNHHOWG3MBAQP4LBKH64A", "38VQ1AW9T5R7EAHTZ8SMXA7NR7J62E", "35DNGIKWSGNJTPD2ZEX0Y5XEUCJ71R", "3SKITTYV05YWZSDC386RGKCFXLJ63P", "3GBCJUK5B11E755LSLD34C2Q6V7PKM", "3PYK988VEHLTI5LLVXTWEDRVY6S9XH", "36R3RQSDQUGJM0SK3VT0K0E4PKI70T", "3K8YRYAXTNY2H1YHU8XXDEXSRQ6DGP", "3SI493PTSWQ3S4N0UHF6QGKVRIHDZF", "3IJ5583D9EWBIPVAMIDYQZZU9NWE0E", "3WRXIMH6E1E5X224PNCJ7U84KKDL4A"];
         // for $3:
        // var test1 = ["3X3BKUX7FNC0LWG37KYKPLCRODVUUV", "36R3RQSDQUGJM0SK3VT0K0E4PKI70T", "3WRXIMH6E1E5X224PNCJ7U84KKDL4A", "37A2SHHJB9RQFEMLEJZ7IBMD8QPKJ9", "3K8YRYAXTNY2H1YHU8XXDEXSRQ6DGP", "3TFUINTXMPSM1OC1QNSZPA6PJD49T2"];
         var test1 = ["36R3RQSDPTWYORIPVZRHA04Z92G07X", "3DCXWU0MRCQLYYQEC5IFGBS8J6ZVTW", "3X3BKUX7FNC0LWG37KYKPLCRODVUUV", "3J7NKU373P6SRYHNWFS7KLU34S5VVT", "3PHLPV04IQAUHNOBFVJ54QJOYKD7PG", "3SZ4WBITUEA66T873ZNWR7L5Q8IXKH", "36R3RQSDQUGJM0SK3VT0K0E4PKI70T", "3WRXIMH6E1E5X224PNCJ7U84KKDL4A", "37A2SHHJB9RQFEMLEJZ7IBMD8QPKJ9", "3K8YRYAXTNY2H1YHU8XXDEXSRQ6DGP", "3TFUINTXMPSM1OC1QNSZPA6PJD49T2"];
         
         
          var test2 = previewLink.replace("/mturk/preview?groupId=", "");
          var test3 = test1.indexOf(test2);
          if(test3 === -1){
          var winOpen =  window.open(previewAndAcceptEl, width=100, height=100);
          //winOpen.opener.close();
            
            //window.close("https://www.mturk.com/mturk/findhits?match=true");
            
            //clearTimeout(myT1);
            /*
            function t6(){
                clearTimeout(t4);
            }
            document.addEventListener("DOMContentLoaded",t6,false);
            
            */
            //clearTimeout(function(){location.reload()});
            //clearTimeout(myt4);
            break;
            
          }
          //else
         // {
           //   setTimeout(location.reload(), 5000);
         // }
          
        }
    }
}

    

var myt4 = setTimeout( function() {
            location.reload( true );
        }, 1000 );    
// following is probably working - check again with lots of data
if (test3 === -1){
   clearTimeout(myt4); 
}