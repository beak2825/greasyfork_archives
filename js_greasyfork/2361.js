// ==UserScript==
// @id             41f11ead-b1c5-4b87-a7d8-403c1fe2904f@scriptish
// @name           Desktop Notification for OWA 2003
// @version        0.3
// @namespace      https://greasyfork.org/scripts/2361-desktop-notification-for-owa-2003
// @author         Ian Chu
// @description    An experimental script to play sound and to show notification for mail arrival on Outlook Web App 2003
// @include        */owa/
// @include        */owa/#
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/2361/Desktop%20Notification%20for%20OWA%202003.user.js
// @updateURL https://update.greasyfork.org/scripts/2361/Desktop%20Notification%20for%20OWA%202003.meta.js
// ==/UserScript==


(function () {
    var favicon, notifSound;
    var requestPermission = function() {
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            welcome();
        });
    }
    var welcome = function () {
        new Notification(
            'Notification extension for Outlook WebApp', {
                icon: favicon,
                body: 'From now on, when you receive new mail,\n' +
                      'A notification box will appear like this.',
                onclick: function () {
                    window.focus();
                }
            }
        );
    }
    var lastPushedNumber = 0;
    var checkNewMailNotif = function () {
        var lnkNwMl = document.getElementById('lnkNwMl');
        if (lnkNwMl) {
            var pushedNumber = Number(lnkNwMl.getAttribute('_pushed'));
            if (pushedNumber > lastPushedNumber) {
                var newItemDialog = document.getElementById('idNewItmDlg');
                var spans = newItemDialog.getElementsByTagName('span');
                var nwItmTxtFrm, nwItmTxtSbj;
                for (var i = 0; i < spans.length; i++) {
                    if (spans[i].className.indexOf('nwItmTxtFrm') >= 0)
                       nwItmTxtFrm = spans[i];
                    else if (spans[i].className.indexOf('nwItmTxtSbj') >= 0)
                       nwItmTxtSbj = spans[i];
                }
                var mailFrom = nwItmTxtFrm.textContent;
                var mailSubj = nwItmTxtSbj.textContent;
                requestPermission();
                new Notification(mailFrom, {
                    icon: favicon,
                    body: mailSubj,
                    onclick: function () {
                        window.focus();
                        nwItmTxtFrm.click();
                    }
                });
				notifSound.play();
            }
            lastPushedNumber = pushedNumber;
        } else {
            lastPushedNumber = 0;
        }
    }
	
	// --- icon and sound ---
    var linkTags = document.getElementsByTagName('head')[0].getElementsByTagName('link');
    for (var i = 0; i < linkTags.length; i++) {
        if (linkTags[i].getAttribute('rel').indexOf('icon') >= 0) {
            favicon = linkTags[i].getAttribute('href');
            break;
        }
    }
	notifSound = new Audio();
	notifSound.src = 'data:audio/ogg;base64,' +
        'T2dnUwACAAAAAAAAAAAhBwAAAAAAAF1ZYUIBHgF2b3JiaXMAAAAAAUSsAAAAAAAAgDgBAAAAAAC4' +
		'AU9nZ1MAAAAAAAAAAAAAIQcAAAEAAADQQ/V0Di3///////////////+BA3ZvcmJpcx0AAABYaXBo' +
		'Lk9yZyBsaWJWb3JiaXMgSSAyMDA3MDYyMgAAAAABBXZvcmJpcyJCQ1YBAEAAACRzGCpGpXMWhBAa' +
		'QlAZ4xxCzmvsGUJMEYIcMkxbyyVzkCGkoEKIWyiB0JBVAABAAACHQXgUhIpBCCGEJT1YkoMnPQgh' +
		'hIg5eBSEaUEIIYQQQgghhBBCCCGERTlokoMnQQgdhOMwOAyD5Tj4HIRFOVgQgydB6CCED0K4moOs' +
		'OQghhCQ1SFCDBjnoHITCLCiKgsQwuBaEBDUojILkMMjUgwtCiJqDSTX4GoRnQXgWhGlBCCGEJEFI' +
		'kIMGQcgYhEZBWJKDBjm4FITLQagahCo5CB+EIDRkFQCQAACgoiiKoigKEBqyCgDIAAAQQFEUx3Ec' +
		'yZEcybEcCwgNWQUAAAEACAAAoEiKpEiO5EiSJFmSJVmSJVmS5omqLMuyLMuyLMsyEBqyCgBIAABQ' +
		'UQxFcRQHCA1ZBQBkAAAIoDiKpViKpWiK54iOCISGrAIAgAAABAAAEDRDUzxHlETPVFXXtm3btm3b' +
		'tm3btm3btm1blmUZCA1ZBQBAAAAQ0mlmqQaIMAMZBkJDVgEACAAAgBGKMMSA0JBVAABAAACAGEoO' +
		'ogmtOd+c46BZDppKsTkdnEi1eZKbirk555xzzsnmnDHOOeecopxZDJoJrTnnnMSgWQqaCa0555wn' +
		'sXnQmiqtOeeccc7pYJwRxjnnnCateZCajbU555wFrWmOmkuxOeecSLl5UptLtTnnnHPOOeecc845' +
		'55zqxekcnBPOOeecqL25lpvQxTnnnE/G6d6cEM4555xzzjnnnHPOOeecIDRkFQAABABAEIaNYdwp' +
		'CNLnaCBGEWIaMulB9+gwCRqDnELq0ehopJQ6CCWVcVJKJwgNWQUAAAIAQAghhRRSSCGFFFJIIYUU' +
		'YoghhhhyyimnoIJKKqmooowyyyyzzDLLLLPMOuyssw47DDHEEEMrrcRSU2011lhr7jnnmoO0Vlpr' +
		'rbVSSimllFIKQkNWAQAgAAAEQgYZZJBRSCGFFGKIKaeccgoqqIDQkFUAACAAgAAAAABP8hzRER3R' +
		'ER3RER3RER3R8RzPESVREiVREi3TMjXTU0VVdWXXlnVZt31b2IVd933d933d+HVhWJZlWZZlWZZl' +
		'WZZlWZZlWZYgNGQVAAACAAAghBBCSCGFFFJIKcYYc8w56CSUEAgNWQUAAAIACAAAAHAUR3EcyZEc' +
		'SbIkS9IkzdIsT/M0TxM9URRF0zRV0RVdUTdtUTZl0zVdUzZdVVZtV5ZtW7Z125dl2/d93/d93/d9' +
		'3/d93/d9XQdCQ1YBABIAADqSIymSIimS4ziOJElAaMgqAEAGAEAAAIriKI7jOJIkSZIlaZJneZao' +
		'mZrpmZ4qqkBoyCoAABAAQAAAAAAAAIqmeIqpeIqoeI7oiJJomZaoqZoryqbsuq7ruq7ruq7ruq7r' +
		'uq7ruq7ruq7ruq7ruq7ruq7ruq7ruq4LhIasAgAkAAB0JEdyJEdSJEVSJEdygNCQVQCADACAAAAc' +
		'wzEkRXIsy9I0T/M0TxM90RM901NFV3SB0JBVAAAgAIAAAAAAAAAMybAUy9EcTRIl1VItVVMt1VJF' +
		'1VNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVN0zRNEwgNWQkAAAEA0FpzzK2XjkHo' +
		'rJfIKKSg10455qTXzCiCnOcQMWOYx1IxQwzGlkGElAVCQ1YEAFEAAIAxyDHEHHLOSeokRc45Kh2l' +
		'xjlHqaPUUUqxplo7SqW2VGvjnKPUUcoopVpLqx2lVGuqsQAAgAAHAIAAC6HQkBUBQBQAAIEMUgop' +
		'hZRizinnkFLKOeYcYoo5p5xjzjkonZTKOSedkxIppZxjzinnnJTOSeack9JJKAAAIMABACDAQig0' +
		'ZEUAECcA4HAcTZM0TRQlTRNFTxRd1xNF1ZU0zTQ1UVRVTRRN1VRVWRZNVZYlTTNNTRRVUxNFVRVV' +
		'U5ZNVbVlzzRt2VRV3RZV1bZlW/Z9V5Z13TNN2RZV1bZNVbV1V5Z1XbZt3Zc0zTQ1UVRVTRRV11RV' +
		'2zZV1bY1UXRdUVVlWVRVWXZdWddVV9Z9TRRV1VNN2RVVVZZV2dVlVZZ1X3RV3VZd2ddVWdZ929aF' +
		'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' ;

    // --- Init ---
    welcome();
    requestPermission();
    setInterval(checkNewMailNotif, 1000);
    
}) ();
