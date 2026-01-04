
// https://github.com/Tampermonkey/tampermonkey/issues/853#issuecomment-892417299
// Original poster might consider closing this issue. As mentioned, "require" is already available to reuse libs. The error message was just pointing out that "mylibrary" wasn't a working URI. GreasyFork or GitHub would work fine for publishing the lib itself.


    function inputElemChinese(elem, chtext) {

        // Set focus on the input element
        elem.click();
        elem.focus();

        elem.value = chtext;

        for (var i = 0; i < chtext.length; i++) {
            var char = chtext.charAt(i);
            var event3 = new CompositionEvent('compositionstart', { bubbles: true });
            elem.dispatchEvent(event3);

            var eventInput = new InputEvent('input', { bubbles: true });
            elem.dispatchEvent(eventInput);

            var event4 = new CompositionEvent('compositionend', { bubbles: true });
            elem.dispatchEvent(event4);
        }

        var keyUpEventDone = {
            value: false
        };
        setTimeout(() => {
            // Simulate pressing the Enter key
            var enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            elem.dispatchEvent(enterEvent);

            setTimeout(() => {
                var enterEvent2 = new KeyboardEvent('keyup', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                elem.dispatchEvent(enterEvent2);
                keyUpEventDone.value = true;
            }, 99);
        }, 1200);


        return keyUpEventDone;
    }
    // queryElemByClassAndText('label.el-form-item__label', '产权凭证号')
    function queryElemByClassAndText(selector, textToFind) {

        // Get all span elements
        var elems = document.querySelectorAll(selector);

        // Loop through the elements
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];

            if (elem.textContent.trim().includes(textToFind)) {
                console.log('elem:', elem);
                return elem;
            }
        }
        return null;
    }
    function clickSpanByTextOOOOK(textToFind) { // 2024-08-20 Claude 3 Sonnet (self-moderated)

        // Get all span elements
        var spanElements = document.querySelectorAll('span.el-checkbox__label');

        // Loop through the span elements
        for (var i = 0; i < spanElements.length; i++) {
            var spanElement = spanElements[i];

            // Check if the span element's text content matches the desired text
            if (spanElement.textContent.trim().includes(textToFind)) {
                console.log('spanElement', spanElement);
                spanElement.click();
                return true;
            }
        }

        // If no span element with the desired text was found, return false
        return false;
    }
    function clickSpanByTextBad2(textToFind) {
        /* 2024-08-20 Claude 3 Sonnet (self-moderated)
        The issue with your code is that the document.evaluate method used for XPath evaluation is not supported in all browsers.
        It works in Firefox, but not in Chrome or other Chromium-based browsers like Edge or Opera.
        Additionally, the XPathResult object is not a standard web API and is only supported in Firefox.
        Here's an alternative approach that uses querySelectorAll to find the span elements and checks their text content:
        */

        // Use XPath to find the span with the specified text
        var xpath = "//span[contains(text(), '" + textToFind + "')]";
        var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var spanElement = result.singleNodeValue;

        console.log('spanElement', spanElement);

        // Check if the element was found
        if (spanElement) {
            spanElement.click()
            return true;
        }
        return false;
    }

    function clickSpanByTitle(title1) {
        // var elem = document.querySelector('p[title="我的待办(OA)"]');
        var elem = document.querySelector('span[title="' + title1 + '"]');

        console.log('elem', elem);

        // Check if the element was found
        if (elem) {
            elem.click()
            /*
            elem.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
            */
            return true;
        }
        return false;
    }
