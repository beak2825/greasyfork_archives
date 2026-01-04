// ==UserScript==
// @name         FifaRosters Auto Card Generator
// @namespace    http://myfootballfantasy.de/
// @version      1.3
// @description  Automatischer Kartengenerator für FifaRosters von MyFF
// @author       Michi & Martin
// @match        https://www.fifarosters.com/create-card
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372720/FifaRosters%20Auto%20Card%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/372720/FifaRosters%20Auto%20Card%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    changeCardColor = function(color, css_class) {
        removeCustomDesignCss();
        $('#form-card-color').val(color);
        $('#form-card-color').trigger('change');
        var card_year = $('input[name="form-card-year"]:checked').val();
        //var caller = $(event.target);
        //caller.parent('.card_container').addClass('active').siblings('.card_container').removeClass('active');
        updateCardType(css_class);
        $('.modal[id^=card_selector_modal]').modal('hide');
    }

    updateImage = function() {
        $(".playercard-picture img").draggable();
        $(".player-image-type, .custom-image-type").hide();
        if ($("input[name='form-image-type']:checked").val() == "blank") {
            $('.playercard-picture img').hide();
        } else if ($("input[name='form-image-type']:checked").val() == "player") {
            $(".playercard-picture img").draggable("destroy").attr("style", "");
            $(".player-image-type").show();
            $("#form-card-image").each(function() {
                var $thisimage = $(this);
                var $img = $thisimage.val();
                $.get("utils/getImage.php", {
                    image: $img
                }, function(data) {
                    if (data == "true") {
                        $(".playercard-picture img").hide().attr("src", $img).fadeIn("fast");
                    }
                });
            });
            resetImagePosition();
        } else {
            $(".playercard-picture img").draggable("enable").css({
                "max-width": "none",
                "width": $("#form-card-custom-size").val() + "%"
            });
            $(".custom-image-type").show();
            $("#form-card-custom-image").each(function() {
                var $thisimage = $(this);
                var $img = $thisimage.val();
                var img = new Image();
                img.onload = function() {
                    $(".playercard-picture img").hide();
                    updateImageSize();
                    $(".playercard-picture img").attr("src", $img).fadeIn("fast");
                }
                ;
                img.onerror = function() {}
                ;
                img.src = $img;
            });
        }
        changeClubImage();
    };

    var changeClubImage = function () {
        $('#form-card-club-text').val('https://www.futwiz.com/assets/img/fifa15/creator-badges/10020.png').change();
    };

    var updateCardColor = function (ges) {
        ges = parseInt(ges);

        if (!isNaN(ges)) {
            if (ges >= 75) {
                changeCardColor('rare_gold', 'rare gold');
            } else if (ges <= 64) {
                changeCardColor('rare_bronze', 'rare bronze');
            } else {
                changeCardColor('rare_silver', 'rare silver');
            }
        }
    };

    setTimeout(function() {
        updateImage();
    }, 1000);

    $('[for="form-image-type-player"]').before('<label for="form-image-type-blank"><input type="radio" name="form-image-type" value="blank" id="form-image-type-blank"> Blank</label> ');
    $('#form-image-type-blank').prop('checked', true);

    let playerImage = $("input[name='form-image-type'], #form-card-image, #form-card-custom-image").off().on("keyup change", updateImage);

    $('input[name="form-card-year"][value="16"]').prop('checked', true).change();

    changeCardColor('rare_gold', 'rare gold');

    changeClubImage();
    $('#form-card-bottom-chemistry').prop('checked', true).change();
    $('#form-card-chemistry-text').val('MyFF').change();

    $('.generate_image_btn').before('<button class="btn btn-info generate-stats"><i class="fa fa-random"></i> Generate Stats</button> ');

    $('#form-card-position').replaceWith(function () {
        return $('<select id="form-card-position" class="form-control">');
    });

    $('#form-card-position').on('change', function() {
        updateDirect('position');

        let pos = $(this).find(':selected').val();

        if (pos === 'TW') {
            $('#form-card-attr1-text').val('HEC').change();
            $('#form-card-attr2-text').val('BSI').change();
            $('#form-card-attr3-text').val('ABS').change();
            $('#form-card-attr4-text').val('REF').change();
            $('#form-card-attr5-text').val('TMP').change();
            $('#form-card-attr6-text').val('POS').change();

            updateCardColor($('#form-card-rating').val());
        } else if (pos === 'TR') {
            $('#form-card-attr1-text').val('KEY').change();
            $('#form-card-attr2-text').val('SEC').change();
            $('#form-card-attr3-text').val('WEA').change();
            $('#form-card-attr4-text').val('KEY').change();
            $('#form-card-attr5-text').val('SEC').change();
            $('#form-card-attr6-text').val('WEA').change();

            changeCardColor('purple', 'hero');
        } else {
            $('#form-card-attr1-text').val('TEM').change();
            $('#form-card-attr2-text').val('SCH').change();
            $('#form-card-attr3-text').val('PAS').change();
            $('#form-card-attr4-text').val('DRI').change();
            $('#form-card-attr5-text').val('VER').change();
            $('#form-card-attr6-text').val('PHY').change();

            updateCardColor($('#form-card-rating').val());
        }

        changeClubImage();
    });

    $('#form-card-rating').on('change keyup', function() {
        updateCardColor($(this).val());
    });

    $('#form-card-position')
        .append('<option value="IV">IV</option>')
        .append('<option value="LV">LV</option>')
        .append('<option value="RV">RV</option>')
        .append('<option value="LM">LM</option>')
        .append('<option value="RM">RM</option>')
        .append('<option value="ZDM">ZDM</option>')
        .append('<option value="ZM">ZM</option>')
        .append('<option value="ZOM">ZOM</option>')
        .append('<option value="ST">ST</option>')
        .append('<option value="TW">TW</option>')
        .append('<option value="TR">TR</option>')
        .change();

    $('#form-card-attr1').val('0').change();
    $('#form-card-attr2').val('0').change();
    $('#form-card-attr3').val('0').change();
    $('#form-card-attr4').val('0').change();
    $('#form-card-attr5').val('0').change();
    $('#form-card-attr6').val('0').change();

    let generateStats = function() {
        let ges = parseInt($('#form-card-rating').val());
        let pos = $('#form-card-position').val();

        let weakskill1 = Math.round(Math.random()*11-5+(ges/2));
        let weakskill2 = Math.round(Math.random()*11-5+(ges/2));
        let secondskill1 = Math.round(Math.random()*11-5+(ges/6*5));
        let secondskill2 = Math.round(Math.random()*11-5+(ges/6*5));
        let keyskill1 = Math.round(Math.random()*ges*0.1+ges);
        let keyskill2 = Math.round(Math.random()*ges*0.1+ges);

        if (weakskill1 > 99) {
            weakskill1 = 99;
        }
        if (weakskill2 > 99) {
            weakskill2 = 99;
        }
        if (secondskill1 > 99) {
            secondskill1 = 99;
        }
        if (secondskill2 > 99) {
            secondskill2 = 99;
        }
        if (keyskill1 > 99) {
            keyskill1 = 99;
        }
        if (keyskill2 > 99) {
            keyskill2 = 99;
        }

        switch(pos) {
            case 'TW':
                $('#form-card-attr1').val(keyskill1).change();
                $('#form-card-attr2').val(secondskill1).change();
                $('#form-card-attr3').val(weakskill1).change();
                $('#form-card-attr4').val(keyskill2).change();
                $('#form-card-attr5').val(weakskill2).change();
                $('#form-card-attr6').val(secondskill2).change();
                break;
            case 'IV':
                $('#form-card-attr1').val(weakskill1).change();
                $('#form-card-attr2').val(weakskill2).change();
                $('#form-card-attr3').val(secondskill1).change();
                $('#form-card-attr4').val(secondskill2).change();
                $('#form-card-attr5').val(keyskill1).change();
                $('#form-card-attr6').val(keyskill2).change();
                break;
            case 'LV':
            case 'RV':
                $('#form-card-attr1').val(keyskill1).change();
                $('#form-card-attr2').val(weakskill1).change();
                $('#form-card-attr3').val(secondskill1).change();
                $('#form-card-attr4').val(weakskill2).change();
                $('#form-card-attr5').val(keyskill2).change();
                $('#form-card-attr6').val(secondskill2).change();
                break;
            case 'LM':
            case 'RM':
                $('#form-card-attr1').val(keyskill1).change();
                $('#form-card-attr2').val(secondskill1).change();
                $('#form-card-attr3').val(keyskill2).change();
                $('#form-card-attr4').val(secondskill2).change();
                $('#form-card-attr5').val(weakskill1).change();
                $('#form-card-attr6').val(weakskill2).change();
                break;
            case 'ZDM':
                $('#form-card-attr1').val(secondskill1).change();
                $('#form-card-attr2').val(weakskill1).change();
                $('#form-card-attr3').val(keyskill1).change();
                $('#form-card-attr4').val(weakskill2).change();
                $('#form-card-attr5').val(keyskill2).change();
                $('#form-card-attr6').val(secondskill2).change();
                break;
            case 'ZM':
                $('#form-card-attr1').val(secondskill1).change();
                $('#form-card-attr2').val(secondskill2).change();
                $('#form-card-attr3').val(keyskill1).change();
                $('#form-card-attr4').val(keyskill2).change();
                $('#form-card-attr5').val(weakskill1).change();
                $('#form-card-attr6').val(weakskill2).change();
                break;
            case 'ZOM':
                $('#form-card-attr1').val(keyskill1).change();
                $('#form-card-attr2').val(keyskill2).change();
                $('#form-card-attr3').val(secondskill1).change();
                $('#form-card-attr4').val(secondskill2).change();
                $('#form-card-attr5').val(weakskill1).change();
                $('#form-card-attr6').val(weakskill2).change();
                break;
            case 'ST':
                $('#form-card-attr1').val(keyskill1).change();
                $('#form-card-attr2').val(keyskill2).change();
                $('#form-card-attr3').val(weakskill1).change();
                $('#form-card-attr4').val(secondskill1).change();
                $('#form-card-attr5').val(weakskill2).change();
                $('#form-card-attr6').val(secondskill2).change();
                break;
            default:
                alert('Die Position "' + pos + '" ist ungültig!');
                break;
        }

        changeClubImage();
    }

    $('.generate-stats').click(function () {
        generateStats();
    });
})();