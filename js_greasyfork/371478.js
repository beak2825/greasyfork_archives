// ==UserScript==
// @name         Gaia Sort
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Inventory color-sorter.
// @author       cae (twitter @mmt_n_)
// @match        https://www.gaiaonline.com/inventory*
// @run-at document-end
// @require https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.0.1/color-thief.min.js
// @downloadURL https://update.greasyfork.org/scripts/371478/Gaia%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/371478/Gaia%20Sort.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var values = [], itemcnt = 0, colorThief, noerror = true;
    console.log('hi!')
    $('body').prepend('<button id="sorterbtn" style="position:fixed;z-index:999999999;background:white;padding:20px;font-size:200%;bottom:1em;right:1em">sort inventory</button>')
    $('#sorterbtn').on("click", function () {
        colorThief = new ColorThief();
        $('.yui-nav')[0].style.cssText = 'opacity: 0.8; '
        $('#items_tabview')[0].style.cssText = 'pointer-events:none'
        $('#sorterbtn').prop('disabled', true).text('(this might take a while)');
        sorter.imgs()

    })
    $('.yui-nav').on("click", function () {
        $('#sorterbtn').prop('disabled', true).text('wait a few seconds...');

        setTimeout(function () {
            $('#sorterbtn').prop('disabled', false).text('sort inventory');

        }, 5000);
    });

    const sorter = {
        imgs: function () {
            values = []
            let count = 0, targ = $('.yui-nav .selected em').text().replace(/\!/,'').toLowerCase()
            $('#' + targ + ' img').each(function (i, ele) {
                // fetch images so we can actually analyze them
                // since CORS is a dick
                try {
                    $(ele).attr('crossOrigin', '')
                    $.ajax({
                        url: ele.src,
                        type: 'get',
                        dataType: 'html',
                        async: false,
                        crossDomain: 'true',
                        beforeSend: function (xhr) {xhr.overrideMimeType('text/plain; charset=x-user-defined');},
                        success: function (result, textStatus, jqXHR) {
                            var binary = "";
                            var responseText = jqXHR.responseText;
                            var responseTextLen = responseText.length;
                            for ( i = 0; i < responseTextLen; i++ ) {
                                binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
                            }
                            console.log('replaced!')
                            $(ele).attr('src', 'data:image/png;base64,' + btoa(binary))

                            count ++
                            if (count >= $('#' + targ + ' img').length) {
                                console.log('Images ready.')
                                sorter.colors()
                            }
                        }
                    });
                } catch (err) {
                    console.log(err)
                    alert('Sorry, something went wrong.')
                    return false
                }
            })
        },
        colors: function () {
            let count = 0;
            let targ = $('.yui-nav .selected em').text().replace('!','').toLowerCase()
            $('#' + targ + ' img').each(function (i, ele) {
                if (noerror) {
                    $(ele).load(() => {
                        try {
                            // get color & clone of original
                            let res = colorThief.getColor(ele)
                            let el = $(ele).parent()[0].cloneNode(true)

                            // set slot, color, and the element copy
                            values[i] = [$(el).parent()[0].slot, res, $(ele).parent()[0]]
                            count ++
                            if (count >= $('#' + targ + ' img').length) {
                                console.log('Colors found.')
                                sorter.sort()
                            }
                        } catch (err) {
                            // if that doesn't work, crop canvas n try again (too much transparency fucks it up I guess

                            let canvas = $('<canvas/>'),
                                context = canvas[0].getContext('2d')

                            context.drawImage(ele, 7, 7, 16, 16, -1, -1, 32, 32);


                            // then try again
                            try {
                                let res = colorThief.getColor(canvas[0])
                                let el = $(ele).parent()[0].cloneNode(true)
                                values[i] = [$(ele).parent()[0].slot, res, $(ele).parent()[0]]
                                count ++
                                if (count >= $('#' + targ + ' img').length) {
                                    console.log('Colors found.')
                                    sorter.sort()
                                }
                            } catch (err) {
                                // past that you're probably fucked tbh
                                console.log('something went wrong on ' + ele.alt)
                                console.log(ele)
                                alert("Huh, there's a problem somewhere. Refresh and try again?")
                                noerror = false
                                return false
                            }
                        }
                    })
                }
            })
        },
        // adapted from https://stackoverflow.com/questions/11923659/javascript-sort-rgb-values
        sort: function () {
            let targ = $('.yui-nav .selected em').text().replace('!','').toLowerCase()

            var result = values.map(function(x, i) {
                // Convert to HSL and keep track of original indices
                return {index: i, slot: x[0], color: sorter.HSL(x[1]), ele: x[2]};
            }).sort(function(c1, c2) {
                // sort colors
                return c1.color[0] - c2.color[0];
            }).map(function(data) {
                // just marks where the item's original position was
                return values[data.index];
            });
            // clear out current inventory box
            // adds everything into the inventory in the new order
            let x = '';
            for (let res in result) {
                x += result[res][2].outerHTML
            }
            console.log('complete.')
            $('#' + targ + ' ul').html(x)
            $('.yui-nav, #items_tabview').removeAttr('style');
            $('#sorterbtn').html('All done! Drag the last object<br>to trigger changes, then save')
        },
        // adapted from same stackoverflow as previous
        HSL: function (a) {var e,r,s=a[0]/255,c=a[1]/255,n=a[2]/255,t=Math.max(s,c,n),i=Math.min(s,c,n),b=(t+i)/2;if(t==i)e=r=0;else{var h=t-i;switch(r=b>.5?h/(2-t-i):h/(t+i),t){case s:e=(c-n)/h+(c<n?6:0);break;case c:e=(n-s)/h+2;break;case n:e=(s-c)/h+4}e/=6}return new Array(360*e,100*r,100*b)}
    }
    })();
