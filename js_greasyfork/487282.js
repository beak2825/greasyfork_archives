// ==UserScript==
// @name         T3KYS Kısıt Kaldırma
// @namespace    https://www.t3kys.com/
// @version      1.0
// @description  Enable cut, copy, and paste functionality for input fields and text areas on t3kys.com
// @author       T3KYS
// @match        https://www.t3kys.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487282/T3KYS%20K%C4%B1s%C4%B1t%20Kald%C4%B1rma.user.js
// @updateURL https://update.greasyfork.org/scripts/487282/T3KYS%20K%C4%B1s%C4%B1t%20Kald%C4%B1rma.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Restore cut, copy, paste functionality
    $('input[type="text"], textarea').unbind("cut copy paste");

    // Handle select change event
    $(document).on('change', '.form-group .mt-2 .select', function() {
        var id = $(this).find(":selected").val();
        if (id) {
            id = parseInt(id);
            $.ajax({
                url: '/tr/program/apply/countCheck/',
                data: {
                    'id': id
                },
                success: function(data) {
                    if (data.count > 100) {
                        $(".btn-block").prop('disabled', true);
                        Swal.fire({
                            title: data.name,
                            text: data.messages,
                            icon: "error",
                            showCancelButton: true,
                            showConfirmButton: false,
                            cancelButtonText: 'Kapat'
                        });
                    } else {
                        $(".btn-block").prop('disabled', false);
                    }
                },
                error: function(data) {
                    console.log(data);
                }
            });
        }
    });

    // Function to auto select the second option in select elements with class "select"
    function autoSelectSecondOption() {
        $(".form-control.select").each(function() {
            var options = $(this).find('option');
            if (options.length > 1) {
                $(this).val(options.eq(1).val());
            }
        });
    }

    // Function to auto check the checkbox with the specified name
    function autoCheckCheckbox(checkboxName) {
        $('input[type="checkbox"][name="' + checkboxName + '"]').prop('checked', true);
    }

    // Auto select second value in select
    autoSelectSecondOption();

    // Auto check the checkbox with name "answerFields[107553]"
    autoCheckCheckbox("answerFields[107553]");

    // Auto select "Hayır" option in the select with name "answerFields[107551]"
    $('select[name="answerFields[107551]"]').val("1363");
})(jQuery);
