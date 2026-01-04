// ==UserScript==
// @name         Category Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Dynamic search
// @author       MH
// @match        http://147.32.8.168/?q=node/add/image*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35254/Category%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/35254/Category%20Search.meta.js
// ==/UserScript==


    jQuery.fn.filterByText = function(textbox, selectSingleMatch) {
        return this.each(function() {
            var select = this;
            var options = [];
            var nadrazena = [];
            $(select).find('option').each(function() {
                options.push({value: $(this).val(), text: $(this).text()});
            });
            $(select).data('options', options);
            $(textbox).bind('change keyup', function() {
                var options = $(select).empty().data('options');
                var hodnotas= String($('#textbox').val());
                var hodnota = hodnotas.length;
                console.log(hodnota);
                var search = $(this).val().trim();
                var regex = new RegExp(search,"gi");

                $.each(options, function(i) {
                    var option = options[i];
                    //var counts = (options[i].text.substring(0,5).match(/-/g) || []).length;
                    if(option.text.match(regex) !== null) {
                        var count = (option.text.substring(0,5).match(/-/g) || []).length;
                        console.log(count);
                        j = i;
                        while (j>0) {
                              j = j-1;
                              var counts = (options[j].text.substring(0,5).match(/-/g) || []).length;
                            if(counts < count){
                                if(nadrazena.indexOf(j) === -1){
                                    $(select).append(
                                        $('<option>').text(options[j].text).val(options[j].value)
                                    );
                                    nadrazena.push(j);
                                    break;
                            } else {
                                break;
                                }
                            }
                        }
                        $(select).append(
                           $('<option>').text(option.text).val(option.value)
                        );
                    }
                });
                if(hodnota > 1){
                    nadrazena = [];
                    }
                if (selectSingleMatch === true && $(select).children().length === 1) {
                    $(select).children().get(0).selected = true;
                }
            });
        });
    };


$(".form-select.required").before ( `
<script>
    $(function() {
        $('#edit-taxonomy-12').filterByText($('#textbox'), false);
      $("select option").click(function(){
        alert(1);
      });
    });
</script>
<input id="textbox" type="text" placeholder="Hledat kategorii..."/>
<br>
` );