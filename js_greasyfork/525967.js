// ==UserScript==
// @name Safeway For U Coupon Clipper
// @include https://www.safeway.com/foru/coupons-deals.html*
// @version 1.2
// @namespace https://greasyfork.org/users/864548
// @description Clip all the coupons on the current (as of 02/05/2025) Safeway Just For U coupon system.
// @downloadURL https://update.greasyfork.org/scripts/525967/Safeway%20For%20U%20Coupon%20Clipper.user.js
// @updateURL https://update.greasyfork.org/scripts/525967/Safeway%20For%20U%20Coupon%20Clipper.meta.js
// ==/UserScript==

javascript: (function() {
    "use strict";
    var promises = [];
    var allcoupons = Object.values(JSON.parse(localStorage.getItem("abJ4uCoupons"))["objCoupons"]);
    var coupons = allcoupons.filter(function(x) {
        return x.status === "U";
    }).filter(function(y) {
        return y.deleted !== 0;
    });
    if (coupons.length > 0) {
        window.alert("clipping " + coupons.length + " of " + allcoupons.length + " coupons");
        coupons.forEach(function(item) {
            var data = {
                    "items": []
                },
                clip = {},
                list = {};
            clip.clipType = "C";
            clip.itemId = item.offerId;
            clip.itemType = item.offerPgm;
            list.clipType = "L";
            list.itemId = item.offerId;
            list.itemType = item.offerPgm;
            data.items.push(clip);
            data.items.push(list);
            var request = new Request(window.AB.couponClipPath, {
                method: 'POST',
                mode: 'cors',
                redirect: 'error',
                headers: new Headers(window.AB.j4uHttpOptions),
                body: JSON.stringify(data)
            });
            var promise = fetch(request).then(function(response) {
                return response.json();
            }).then(function(itemjson) {
                if (itemjson.items[0]["status"] === 1) {
                    var wtf = JSON.parse(localStorage.getItem("abJ4uCoupons"));
                    if (wtf.objCoupons[item.offerId] && wtf.objCoupons[item.offerId]["offerId"] === item.offerId) {
                        wtf.objCoupons[item.offerId].status = "C";
                        localStorage.setItem("abJ4uCoupons", JSON.stringify(wtf));
                    } else {
                        var index = wtf.objCoupons.findIndex(function(obj) {
                            return obj.offerId === item.offerId
                        });
                        if (index !== -1) {
                            wtf.objCoupons[index].status = "C";
                            localStorage.setItem("abJ4uCoupons", JSON.stringify(wtf));
                        }
                    }
                }
            });
            promises.push(promise);
        });
        Promise.all(promises).then(function() {
            if (Object.values(JSON.parse(localStorage.getItem("abJ4uCoupons"))["objCoupons"]).filter(function(x) {
                    return x.status === "U";
                }).filter(function(y) {
                    return y.deleted !== 0;
                }).length > 0) {
                window.alert("there are still some unclipped coupons - something probably broke this script");
            } else {
                window.alert("all coupons clipped - reloading page");
            }
            localStorage.removeItem("abCoupons");
            localStorage.removeItem("abJ4uCoupons");
            location.reload();
        });
    } else {
        if (allcoupons.length > 0) {
            window.alert("no clippable coupons");
        } else {
            window.alert("no coupons detected");
        }
    }
})();