// ==UserScript==
// @name           Moz PA Calculator
// @description    Adds the ability to add/remove PA values to a running sum on the Moz Keyword Difficulty Page
// @include       http*://moz.com/researchtools/keywords/*
// @version 0.0.1.20140525024115
// @namespace https://greasyfork.org/users/3815-angela
// @downloadURL https://update.greasyfork.org/scripts/3566/Moz%20PA%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/3566/Moz%20PA%20Calculator.meta.js
// ==/UserScript==

$(document).ready(function() {
   
    // Do the magic :)
    var paSum = 0;
    var plusSrc = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAQABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9BP2p/wBr/wAOftTeDvB62Hh/XbLTrXUjrEkurPp5hngbTb2KMeXFcySkmS4hOCg4XPaud/ZA/bu8PfshfDfxpZ694X8T3lvca7NrMMmlSab5Udv9itIyNk13FICHhkOAmD2JOa5b9t/9ibw1+wX4G8Ia9ZfEDxjdWFxqcujyWuvX9l9gitxpV9KhBFsjqyywQAEufvY71gf8E/f2EPD/APwUM+FvjzxDrHxB8aWdhaeJ59At7fQruwNpLaixspzzLazNktcSKdrgBcAAEEn+e44Piv8A1qWIl7P23s7deXkv93NY/JZzzpZyoxUfauN+lrH/2Q==";
    var minusSrc = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAQABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9fbj/AIKNeCbK1Sa40zxDbRyIsimZ7GMlWGRw1yCOD3rE1X/grF8LNFt5JLltSjWNS2PtWnFmwMkAC6yTjt7189+Iv+CD/irxa/mah8efOmaNEZn8HLITtUL1N3zwPQVyWs/8G3Gpazu3/HILuwWK+DlUtg+13gdMZwfvGvg/rfFDnZUIKPdtbfJ7n9HYPIvCRxTxWZTT/u06z+WsfxP/2Q==";
        
    $('#ranking-factors-table').append('<div id="paSumLabel">Total selected PA: <span id="paSum" style="color:red;font-weight:bold">0</span></div>');
	$('#ranking-factors-table').find('.g-row.row').each(function(){
        var plus = $('<img style="padding-left: 5px" alt="" />');
        plus.attr('src', plusSrc);
        var paCell = $(this).find('.g-cell').eq(2);
        var pa = +(paCell.first().text());
        if(isNaN(pa)) pa = 0;
        
        var addPA = plus.click(function(){ 
        	if($(this).attr('src') == plusSrc) {
                paSum += pa;
               $(this).attr('src', minusSrc);
            }
            else {
             	paSum -= pa;
               $(this).attr('src', plusSrc);
            }
            
            $('#paSum').text(paSum);
        });
        paCell.append(addPA);
	});
});
