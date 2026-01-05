// ==UserScript==
// @author       Mobius Evalon
// @name         Cielo job frame tinkerer
// @description  An extension to the CrowdSurf productivity tools script that circumvents sandbox security to directly modify the code of the transcription frame.
// @version      0.8
// @namespace    mobiusevalon.tibbius.com
// @license      Creative Commons Attribution-ShareAlike 4.0; http://creativecommons.org/licenses/by-sa/4.0/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @include      /^https{0,1}:\/\/ops.cielo24.com\/mediatool\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18073/Cielo%20job%20frame%20tinkerer.user.js
// @updateURL https://update.greasyfork.org/scripts/18073/Cielo%20job%20frame%20tinkerer.meta.js
// ==/UserScript==

// thanks to alandev of GreasyFork for his CrowdSurfDictionary script: https://greasyfork.org/en/scripts/16005-crowdsurfdictionary
// had i not happened across it one day, i may have never found the motivation to start messing around with the spellchecker since
// that script's use of the AtD variable helped me pinpoint the javascript source to modify the function further

// prevents problems when the destination pages are running their own jquery libraries.  isn't necessary when the destination page
// is not running jquery or if the script is sandboxed because of GM_ functions being granted, but it's always good to think ahead
this.$ = this.jQuery = jQuery.noConflict(true);

function cjft_message(event)
{
    // i have to use dom messaging to work around security protocols and sandboxing limitations
    if(event.originalEvent.origin === "https://ops.cielo24.com")
    {
        var data = event.originalEvent.data.split("-");
        if(data[0] === "cjft")
        {
            if(data[1] === "initialize")
            {
                cjft_initialize();
                cjft_word_list(data[2]);
            }
            else if(data[1] === "response")
            {
                if(data[2] === "ignored_words") cjft_word_list(data[3]);
            }
            return false;
        }
    }
}

function cjft_word_list(a)
{
    var ignored_words = [];
    if((typeof a === "string") && a.trim().length) ignored_words = a.split(",");
    cjft_display(ignored_words.length);
    if(ignored_words.length > 0)
    {
        $("#cspt-dictionary-list").text("");
        for(var i=0;i<ignored_words.length;i++)
        {
            AtD.core.setIgnoreStrings(decodeURIComponent(ignored_words[i]));
            cjft_list_word(ignored_words[i]);
        }
    }
}

function cjft_list_word(w)
{
    $("#cspt-dictionary-list").append($("<div/>")
                                      .css({"width":"150px",
                                            "float":"left"})
                                      .text(decodeURIComponent(w))
                                      .append($("<span/>")
                                              .css({"color":"#775555",
                                                    "margin-left":"10px",
                                                    "cursor":"pointer"})
                                              .text("[X]")
                                              .click(function() {window.postMessage(("cspt-request-delete_ignored_word-"+w),"https://ops.cielo24.com");
                                                                 $(this).parent().hide();
                                                                 cjft_display("-1");
                                                                })
                                             )
                                     );
}

function cjft_display(a)
{
    var n = 0;
    if(typeof a === "number") n = Math.floor(a);
    else if(typeof a === "string")
    {
        n = Math.floor($("#cjft-dictionary-count").text()*1);

        if(a === "-1") n--;
        else if(a === "+1") n++;
    }
    $("#cjft-dictionary-count").text(n);
}

function cjft_initialize()
{
    // load ignored words list
    // window.postMessage("cspt-request-ignored_words_list","https://ops.cielo24.com");

    // i can tinker with the spellchecker by overloading the functions
    AtD.__cjft_suggest = AtD.suggest;
    AtD.suggest = function(element) {
        AtD.__cjft_suggest(element);

        $("#suggestmenu")
            .append($("<a/>")
                    .css({"border-bottom":"1px solid #ccc",
                          "cursor":"pointer"})
                    .text("CSPT: Ignore forever")
                    .click(function() {var target = AtD.errorElement.text(),
                                           ec_target = encodeURIComponent(target),
                                           removed = AtD._removeWords(AtD.container,target);

                                       AtD.core.setIgnoreStrings(target);
                                       AtD.counter -= removed;

                                       if(AtD.callback_f !== undefined)
                                       {
                                           if(AtD.counter === 0 && AtD.callback_f.success !== undefined)
                                           {
                                               AtD.callback_f.success(AtD.count);
                                               globalController.dispatcher.trigger('spellcheck:cleared',AtD.counter);
                                           }
                                           if(AtD.callback_f.ignore !== undefined)
                                           {
                                               AtD.callback_f.ignore(target);
                                               AtD.core.setIgnoreStrings(target);
                                           }
                                       }

                                       window.postMessage(("cspt-request-add_ignored_word-"+ec_target),"https://ops.cielo24.com");
                                       cjft_display("+1");
                                       cjft_list_word(ec_target);
                                      })
                   )
            .css("top",($(element).offset().top-$("#suggestmenu").outerHeight())+"px");
    };

    // tab content for the list of ignored words
    $("#tab_content").append($("<div/>")
                             .attr({"class":"tab-pane dictionary",
                                    "id":"dictionary"})
                             .append($("<h3/>")
                                     .text("Ignored spellcheck terms")
                                     .append($("<span/>")
                                             .css({"color":"#775555",
                                                   "margin-left":"10px",
                                                   "font-size":"75%",
                                                   "font-weight":"normal",
                                                   "cursor":"pointer"})
                                             .text("[Empty]")
                                             .click(function() {window.postMessage("cspt-request-purge_ignored_list","https://ops.cielo24.com");
                                                                cjft_display(0);
                                                                $("#cspt-dictionary-list").text("None");
                                                               })
                                            ),
                                     $("<div/>")
                                     .attr("id","cspt-dictionary-list")
                                     .text("None")
                                    )
                            );

    // word list tab
    $("#right-column ul.nav-tabs").append($("<li/>")
                                          .attr("class","dictionary")
                                          .append($("<a/>")
                                                  .attr({"data-toggle":"tab",
                                                         "href":"#dictionary"})
                                                  .html("Dictionary (<span id='cjft-dictionary-count'>0</span>)")
                                                 )
                                         );

    // put the guidelines and feedback buttons in a static position that is not hidden when tabs are changed
    $("#tab_content")
        .css("margin-top","15px")
        .before($("#view-guidelines").css("margin-right","10px")
        // this would normally just move the "send feedback" button to a static position that isn't lost when you change tabs,
        // but there must be an event being attached to it by context that i missed so it'll just have to comment this out for now
        // $("#button_help").removeClass("pull-right").css("margin","0px").text("Report a problem")
    );
    // $("#get_help").remove();
}

$(window).on("message onmessage",cjft_message);