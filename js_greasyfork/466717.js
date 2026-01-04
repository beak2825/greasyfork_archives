/* jshint browser: true, jquery: true */
/* globals $, mw, OO */

// ==UserScript==
// @name         Wikipedia ChatGPT section summaries
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Experiment to use ChatGPT to summarize page sections.
// @author       tonythomas01
// @license      GPL-3.0-or-later
// @match        https://*.wikipedia.org/*
// @icon         https://doc.wikimedia.org/oojs-ui/master/demos/dist/themes/wikimediaui/images/icons/robot.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466717/Wikipedia%20ChatGPT%20section%20summaries.user.js
// @updateURL https://update.greasyfork.org/scripts/466717/Wikipedia%20ChatGPT%20section%20summaries.meta.js
// ==/UserScript==

(function () {
  const GPTModel = "gpt-3.5-turbo";
  const HuggingFacesModelsMap = {
    "FacebookBartLargeCNN": "facebook/bart-large-cnn",
  };

  function main() {
    $('.mw-headline').each(function () {
      var sectionHeading = $(this);
      const editLink = sectionHeading.siblings('.mw-editsection');
      const immediateParent = sectionHeading.parent();

      if (immediateParent.is('h2') || immediateParent.is('.mw-heading2')) {
        var summarizeLink = $('<span>')
          .addClass('mw-summarysection')
          .addClass('mw-editsection')
          .css('margin-left', '0.5em')
          .append(
            $('<span>')
              .addClass('mw-editsection-bracket')
              .text('[')
          )
          .append(
            $('<a>')
              .attr('href', '#')
              .text('summarize')
              .click(function (e) {
                e.preventDefault();
                summarizeSection(sectionHeading);
              })
          )
          .append(
            $('<span>')
              .addClass('mw-editsection-bracket')
              .text(']')
          );

        editLink.after(summarizeLink);
      }
    });
  }

  function loadMain() {
    if (!window.$) {
      return setTimeout(loadMain, 50);
    }
    $(main);
  }
  loadMain();

  function fetchSummaryUsingOpenAPI(fixedPromptForChatGPT, openAPIKey, sectionText, callback) {
    const gptQuery = fixedPromptForChatGPT + sectionText;
    console.log("To GPT: ", gptQuery);

    $.ajax({
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + openAPIKey,
      },
      data: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: gptQuery
          }
        ],
        temperature: 0.7
      }),
      success: function (response) {
        const responseContent = response.choices[0].message.content;
        callback(null, responseContent);
      },
      error: function (error) {
        callback(error);
      }
    });
  }

  function fetchSummaryUsingHuggingFacesModel(apiKeySecret, modelName, sectionText, callback) {
    $.ajax({
      url: "https://api-inference.huggingface.co/models/" + modelName,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKeySecret,
      },
      data: JSON.stringify({
        inputs: sectionText
      }),
      success: function (response) {
        const responseContent = response[0].summary_text;
        callback(null, responseContent);
      },
      error: function (error) {
        callback(error);
      }
    });
  }

  function onSummaryFetch(error, responseContent) {
    if (error) {
      console.log(error);
    } else {
      console.log("LLM model responded: " + responseContent);
    }
  }

  function getSectionTextUnderHeading(namespace, sectionParent) {
    if (sectionParent.parent().is('.mw-heading')) {
      return getSectionText( sectionParent );
    } else {
      return $.Deferred().resolve(
        $('<div>').append(
          sectionParent.nextUntil('h2').clone()
        ).prop('innerText')
      );
    }
  }

    var discussionToolsInfo;
    /**
     * @param {jQuery} $heading
     * @return {jQuery.Promise<Array>}
     */
    function getSectionData( $heading ) {
        var dataPromise;
        if ( discussionToolsInfo ) {
            dataPromise = $.Deferred().resolve( discussionToolsInfo );
        } else {
            dataPromise = mw.loader.using( [ 'mediawiki.api' ] ).then( function () {
                return new mw.Api().get( {
                    action: 'discussiontoolspageinfo',
                    page: mw.config.get( 'wgPageName' ),
                    prop: 'threaditemshtml',
                    format: 'json',
                    formatversion: 2,
                } );
            } ).then( function ( data ) {
                discussionToolsInfo = data;
                return data;
            } );
        }

        var sectionId = $heading.find( '.mw-headline' ).data( 'mw-thread-id' );

        var sectionContent = [];
        var processReplies = function ( reply ) {
            if ( reply.type === 'comment' ) {
                sectionContent.push( { type: 'comment', level: reply.level, author: reply.author, text: getCommentTextFromHtml( reply.html ) } );
            } else if ( reply.type === 'heading' ) {
                sectionContent.push( { type: 'heading', level: reply.level, headingLevel: reply.headingLevel, text: getCommentTextFromHtml( reply.html ) } );
                for ( var i = 0; i < reply.replies.length; i++ ) {
                    processReplies( reply.replies[i] );
                }
            } else {
                console.log( 'Unexpected type: ' + reply.type, reply );
            }
        };

        return dataPromise.then( function ( data ) {
            for ( var i = 0; i < data.discussiontoolspageinfo.threaditemshtml.length; i++ ) {
                var section = data.discussiontoolspageinfo.threaditemshtml[i];
                if ( section.id === sectionId ) {
                    sectionContent.push( { type: 'heading', level: 0, headingLevel: section.level, text: getCommentTextFromHtml( section.html ) } );
                    for ( var j = 0; j < section.replies.length; j++ ) {
                        processReplies( section.replies[j] );
                    }
                }
            }
            return sectionContent;
        } );
    }

    /**
     * @param {string} html
     * @return {string}
     */
    function getCommentTextFromHtml( html ) {
        return $.parseHTML( '<div>' + html + '</div>' ).map( el => el.innerText || '' ).join( '' );
    }

    /**
     * @param {jQuery} $heading
     * @return {jQuery.Promise<string>}
     */
    function getSectionText( $heading ) {
        return getSectionData( $heading ).then( function ( data ) {
            var sectionText = '';
            for ( var i = 0; i < data.length; i++ ) {
                var item = data[i];
                if ( item.type === 'heading' ) {
                    sectionText += '\t'.repeat( item.level ) + '='.repeat( item.headingLevel ) + item.text + '='.repeat( item.headingLevel ) + '\n\n';
                } else if ( item.type === 'comment' ) {
                    sectionText += ( item.author + ': ' + item.text ).replace( /^|\n/g, '$&' + '\t'.repeat( item.level ) );
                }
                sectionText += '\n\n';
            }
            return sectionText;
        } );
    }

    var apiKey = null;
    /**
     * @return {string}
     */
    function getApiKey() {
        if ( apiKey ) {
            return apiKey;
        }

        apiKey = localStorage.getItem( 'LLMApiKey' );
        if ( apiKey ) {
            return apiKey;
        }

        apiKey = prompt( 'Please enter your OpenAI API key from https://platform.openai.com/account/api-keys' );
        if ( !apiKey ) {
            throw new Error( 'Section summary requires an API key!' );
        }
        localStorage.setItem( 'LLMApiKey', apiKey );
    }

  function summarizeSection(sectionHeading) {
    const sectionParent = sectionHeading.parent();
    const selectedLLMModel = GPTModel;
    const LLMApiKey = getApiKey();

    var fixedPromptForChatGPT = "Summarize the following section in less than 50 words:  ";
    const namespace = mw.config.get("wgCanonicalNamespace");
    if (namespace === "Talk") {
      fixedPromptForChatGPT = "Summarize the following section in less than 50 words. See that each row represents a " +
        "reply from a user with the Username presented right before  (talk). Use the usernames when summarizing. \n";
    }

    getSectionTextUnderHeading(namespace, sectionParent).then(function(sectionText) {
      console.log("Found Section Text:", sectionText);
      switch (selectedLLMModel) {
        case GPTModel:
          fetchSummaryUsingOpenAPI(fixedPromptForChatGPT, LLMApiKey, sectionText, onSummaryFetch);
          return;
        default:
          fetchSummaryUsingHuggingFacesModel(LLMApiKey, HuggingFacesModelsMap[selectedLLMModel], sectionText, onSummaryFetch);
          return;
      }
    });
  }
})();
