$(document).ready(function () {
    $('.brand').hover(function () {
        var dynamicBgHeight;

        if ($(this).find('.fa-microsoft').length > 0) {
            dynamicBgHeight = 410;
        } else if ($(this).find('.fa-apple').length > 0) {
            dynamicBgHeight = 250;
        } else if ($(this).find('.fa-linkedin').length > 0) {
            dynamicBgHeight = 370;
        } else if ($(this).find('.fa-discord').length > 0) {
            dynamicBgHeight = 330;
        } else if ($(this).find('.fa-facebook').length > 0) {
            dynamicBgHeight = 370;
        } else if ($(this).find('.fa-twitter').length > 0) {
            dynamicBgHeight = 330;
        } else if ($(this).find('.fa-google').length > 0) {
            dynamicBgHeight = 290;
        } else if ($(this).find('.fa-telegram').length > 0) {
            dynamicBgHeight = 370;
        } else if ($(this).find('.fa-paypal').length > 0) {
            dynamicBgHeight = 300;
        }

        if ($(this).find('.dynamic-background').length === 0) {
            var dynamicBg = $('<div class="dynamic-background"></div>').css({
                'position': 'absolute',
                'border-radius': '5px',
                'bottom': '0',
                'left': '0',
                'width': '35px',
                'height': '0',
                'background-color': 'rgba(0, 0, 0, 0.5)',
                'z-index': '-1',
                'transition': 'height 0.3s ease'
            });
            $(this).prepend(dynamicBg);
        }

        $(this).find('.dynamic-background').css('height', dynamicBgHeight + 'px');

    }, function () {
        $(this).find('.dynamic-background').css('height', '0');
    });
});