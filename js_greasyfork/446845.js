// ==UserScript==
// @name         AO3: [Wrangling] Comment on tags without leaving bins!!!
// @description  Comment on tags via a popup modal, which even has some text formatting options!!
// @version      2.0.0

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446845/AO3%3A%20%5BWrangling%5D%20Comment%20on%20tags%20without%20leaving%20bins%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/446845/AO3%3A%20%5BWrangling%5D%20Comment%20on%20tags%20without%20leaving%20bins%21%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Important: If you use iconify, you'll need to set this to be true once installed!!
    const ICONIFY = false;

    //Checks if using dark mode
    const darkmode = window.getComputedStyle(document.body).backgroundColor == 'rgb(51, 51, 51)'

    //This will load FontAwesome so the icons will properly render
    var font_awesome_icons = document.createElement('script');
    font_awesome_icons.setAttribute('src', 'https://use.fontawesome.com/ed555db3cc.js');
    document.getElementsByTagName('head')[0].appendChild(font_awesome_icons);

    var fa_icons_css = document.createElement('style');
    fa_icons_css.setAttribute('type', 'text/css');
    fa_icons_css.innerHTML = ".comment-formatting, ul.actions { font-family: FontAwesome, Lucida Grande, Lucida Sans Unicode;}"
    document.getElementsByTagName('head')[0].appendChild(fa_icons_css);


    //If the user is in an empty bin, nothing will happen
    if (document.getElementById("wrangulator") == null) {
        return
    }

    //Grabbing the link connected to the edit button
    const actionsbuttons = document.getElementById("wrangulator").querySelectorAll("td > ul.actions")
    const array = a => Array.prototype.slice.call(a, 0)
    const get_url = function get_url(label) {
        // This will return the link if iconify is enabled
        const a = label.parentElement.parentElement.querySelector("ul.actions > li[title='Edit'] > a");
        if (a) {
            return a.href;
        }
        // If there's no iconify, we'll stick with the default path
        const buttons = label.parentElement.parentElement.querySelectorAll("ul.actions > li > a");
        return array(buttons).filter(b => b.innerText == "Edit")[0].href;
    }

    //Adding a comment button after the tag options
    for (const buttonset of actionsbuttons) {
        //UW Tag Snooze Buttons script support
        if (buttonset.querySelector('a').href == "") {
            continue
        }

        //And so begins our decent into madness
        //here be dragons, but I'll do my best to comment them all
        const newli = document.createElement("li")
        newli.title = "Add Comment"
        const button = document.createElement("a");
        button.style.textAlign = "center"

        //If the user has iconify set to be true, we'll show a very cute comment+ icon
        //so they can keep using iconify if they so wish, but there's not two identical icons
        //you are welcome, iconify users
        button.textContent = ICONIFY ? "\u{f086} \u{f067}" : "Comment";
        button.href = "#";
        newli.appendChild(button)

        buttonset.appendChild(newli)
        //If you want the "Works" button to be last, replace that with the following line:
        //buttonset.insertBefore(newli, buttonset.children[buttonset.childElementCount -2])

        //When any of the comment buttons have been clicked
        button.addEventListener("click", (e) => {
            e.preventDefault()

            //If there's already a comment box modal open, close out of it
            if (document.getElementById("commentbox_id") != null) {
                document.body.removeChild(document.getElementById("commentbox_id"))
            }

            //Creating the comment box modal
            const newdiv = document.createElement("div")
            newdiv.id = "commentbox_id"
            newdiv.style.position = "fixed"
            newdiv.style.top = "25%"
            newdiv.style.left = "25%"
            newdiv.style.width = "50%"
            if (darkmode) {
                //...heh
                newdiv.style.backgroundColor = "#696969"
            } else {
                newdiv.style.backgroundColor = "rgb(221, 221, 221)"
            }
            newdiv.style.border = "1px solid black"
            newdiv.style.padding = "5px"
            //the most important part of course ! ;)
            newdiv.style.borderRadius = "5px"

            //This chunk is for the text above the comment text box
            //the following set of divs and spans is SUCH a mess I KNOW I am so sorry i regret it too
            //But anyways I spent like three hours making this still be pretty when you make the webpage thinner or wider
            //so pls admire that at least once, just for me <3
            const titlediv = document.createElement("div")
            titlediv.setAttribute("style", "margin-bottom: 5px;");
            const newdivtitle = document.createTextNode("Comment on tag: ")
            const title = document.createElement("span")

            //Adding the tag's text and then becasue we are cool, making it a hyperlink
            const label = buttonset.parentElement.parentElement.firstElementChild.getElementsByTagName("label")[0]
            const tag_title = document.createElement("a")
            tag_title.target = "_blank"
            tag_title.innerText = label.innerText;
            tag_title.href = get_url(label)
            if (darkmode) {
                tag_title.style.color = "white"
            } else {
                tag_title.style.color = "cornflowerblue"
            }
            let pseud_id = null;
            title.appendChild(tag_title);
            title.style.fontStyle = "italic";
            titlediv.appendChild(newdivtitle)
            titlediv.appendChild(title)

            //The html formatting options we're offering - bold, italics, underline etc
            //a lot of that part was based on the AO3: Comment Formatting Options script by dusty
            //https://greasyfork.org/en/scripts/31400-ao3-comment-formatting-options

            //Feel free to customize the below to suit your wrangling needs!!!
            //The format is button_name: [["Tooltip", "Text on button or fontawesome icon number"], ["What shows up before selected text", "What shows up after selected text"]],
            //For example, try adding the following:
            //ffu: [["freeform for you", "FF"], ["Freeform for you: ", ""]]
            //Also add a comma after every line except for the last one!
            var commentFormatting = document.createElement("ul");
            var commentFormattingOptions = {
                bold_text: [["Bold", "\u{f032}"], ["<strong>", "</strong>"]],
                italic_text: [["Italic", "\u{f033}"], ["<em>", "</em>"]],
                underline_text: [["Underline", "\u{f0cd}"], ["<u>", "</u>"]],
                strike_text: [["Strikethrough", "\u{f0cc}"], ["<s>", "</s>"]],
                insert_link: [["Insert Link", "\u{f0c1}"], ['<a href="">', "</a>"]],
                insert_image: [["Insert Image", "\u{f03e}"], ['<img src="">']],
                blockquote_text: [["Blockquote", "\u{f10d}"], ["<blockquote>", "</blockquote>"]]
            }
            commentFormatting.id = "comment_formatting"
            commentFormatting.setAttribute("class", "actions comment-formatting");
            commentFormatting.setAttribute("style", "float: left; text-align: left; margin-bottom: 3px;");

            //Setting up each button for the html options we are offering
            for (let key in commentFormattingOptions) {
                var commentFormattingOptionItem = document.createElement("li");
                var commentFormattingOptionLink = document.createElement("a");

                commentFormattingOptionItem.setAttribute("class", key);
                commentFormattingOptionItem.setAttribute("title", commentFormattingOptions[key][0][0]);
                commentFormattingOptionItem.style.paddingLeft = "0px"
                commentFormattingOptionItem.style.paddingRight = "2px"
                commentFormattingOptionItem.style.fontSize = "80%"
                commentFormattingOptionItem.style.margin = "0"

                commentFormattingOptionLink.textContent = commentFormattingOptions[key][0][1];
                commentFormattingOptionLink.setAttribute("style", "margin: 1px;");

                commentFormattingOptionItem.appendChild(commentFormattingOptionLink);
                commentFormatting.appendChild(commentFormattingOptionItem);

                //the actual magic when you click each html options button
                commentFormattingOptionLink.addEventListener("click", (e) => {
                    e.preventDefault()

                    //the beginning and the end of the text the user is highlighting, and the value of that text
                    var caretPos = commentFormattingOptionLink.parentElement.parentElement.parentElement.querySelector("TextArea").selectionStart;
                    var caretEnd = commentFormattingOptionLink.parentElement.parentElement.parentElement.querySelector("TextArea").selectionEnd;
                    var textAreaTxt = commentFormattingOptionLink.parentElement.parentElement.parentElement.querySelector("TextArea").value;

                    var formatToAdd
                    var highlightingtext

                    if (caretPos == caretEnd) {
                        //if the user isn't highlighting any text (ie their cursor is just chilling)
                        formatToAdd = commentFormattingOptions[key][1].join("");
                        highlightingtext = false
                    } else {
                        //if the user is highlighting text
                        var textAreaHighlight = textAreaTxt.slice(caretPos, caretEnd);
                        formatToAdd = commentFormattingOptions[key][1].join(textAreaHighlight);
                        highlightingtext = true
                    }

                    //adding the html formatting!!
                    commentFormattingOptionLink.parentElement.parentElement.parentElement.querySelector("TextArea").value = textAreaTxt.substring(0, caretPos) + formatToAdd + textAreaTxt.substring(caretEnd);
                    commentFormattingOptionLink.parentElement.parentElement.parentElement.querySelector("TextArea").focus();

                    //this took a hot minute to figure out how to do
                    if (highlightingtext) {
                        //If the user is highlighting text (ie they want to bold the word 'thing'), the cursor will move to after the closing html tag
                        //so they can just continue typing the next word
                        commentFormattingOptionLink.parentElement.parentElement.parentElement.querySelector("TextArea").selectionStart = caretEnd + commentFormattingOptions[key][1][0].length + commentFormattingOptions[key][1][1].length
                        commentFormattingOptionLink.parentElement.parentElement.parentElement.querySelector("TextArea").selectionEnd = caretEnd + commentFormattingOptions[key][1][0].length + commentFormattingOptions[key][1][1].length
                    } else {
                        //if the user is not highlighting text, we'll put the cursor in the middle of the html tags
                        //so that they can type what it is they want bolded, italicized etc
                        commentFormattingOptionLink.parentElement.parentElement.parentElement.querySelector("TextArea").selectionStart = caretPos + commentFormattingOptions[key][1][0].length
                        commentFormattingOptionLink.parentElement.parentElement.parentElement.querySelector("TextArea").selectionEnd = caretPos + commentFormattingOptions[key][1][0].length
                    }
                });
            }

            //The textbox the user can type their comment in
            const textinput = document.createElement("textarea");
            textinput.style.width = "98%"
            textinput.style.height = "250px"
            textinput.style.display = "block"
            textinput.style.resize = "none"
            textinput.style.marginTop = "5px"
            //again, the most important part ! ;)
            textinput.style.borderRadius = "3px"

            //the cancel/save button part
            const buttondiv = document.createElement("div")
            const savebutton = document.createElement("button");
            savebutton.style.textAlign = "center"

            //OK SO THIS WAS!!! A PAIN!!! AND A HALF!!!! TO FIGURE OUT!!!!!!!!!
            //But!!!! The tag ID that we have immediate access to is NOT the same as the tag ID  wanted in the POST request to actually send the comment!!!!
            //So we have to go grab the correct tag ID
            //BUT! that takes a small amount of time
            //SO! we make the 'comment' button say 'Loading' until that ID is figured out (and also disable that button)
            //then afterwords we change it to say "comment"!
            //the actual place we grab the correct tag ID is a bit later, just wanted to explain why it starts as 'Loading' here
            savebutton.textContent = "Loading...";
            savebutton.disabled = true;

            //When the save button is clicked
            savebutton.addEventListener("click", (e) => {
                savebutton.disabled = true;

                //don't want empty comments
                if (textinput.value.length == 0) {
                    alert("Brevity is the soul of wit, but we need your comment to have text in it.")
                    //We re-enable the button after any error message shows up so that the user can edit their comment and attempt to do better
                    savebutton.textContent = "Comment";
                    savebutton.disabled = false;
                    return
                }

                //THIS WAS ANOTHER PAIN AND A HALF TO FIGURE OUT, MY GOD
                //So basically, when we submit the comment
                //The character count doesn't include the paragraph tags: <p> and </p>
                //So something that is one paragraph and the maximum of 10000 characters is actually 10007 characters and will make the surver angry at us
                //So what we do, is grab the number of paragraphs in the user's text
                //and multiply that by 7 (the character count of each '<p></p>' that is added)
                //then we add THAT to the length of the user text
                //and BOOM!!! the actual length of what we are submitting
                //so now we can accurately tell the user if their text is too long
                var paragraphhtmllen = textinput.value.replace(/\n$/gm, '').split(/\n/).length * 7;
                var textinputlengthactual = textinput.value.length + paragraphhtmllen
                if (textinputlengthactual >= 10000) {
                    alert("Comment is too long; please restrict to 10000 characters or less, including <p></p> tags.")
                    savebutton.textContent = "Comment";
                    savebutton.disabled = false;
                    return
                }

                //what actually submits the comment!!
                const xhr2 = new XMLHttpRequest();
                xhr2.onreadystatechange = function xhr_onreadystatechange() {
                    if (xhr2.readyState == xhr2.DONE) {
                        if (xhr2.status == 200) {
                            //So we can get a 200 OK status but still have an error !!!!!!!
                            //So we check if the response has an error in it
                            //And if so, pass the error up to the user
                            let error = xhr2.responseXML.documentElement.querySelector("#error")
                            if (error) {
                                alert(error.innerText);
                                savebutton.textContent = "Comment";
                                savebutton.disabled = false;
                            } else {
                                //happy path!!
                                //Change the button text to say 'commented' to show the user that their comment was submitted
                                //Then remove the comment modal after half a second
                                savebutton.textContent = "Commented!";
                                setTimeout(function(){
                                    if (newdiv.parentElement != null) {
                                        document.body.removeChild(newdiv)
                                    }
                                }, 500);
                            }
                        } else if (xhr2.status == 429) {
                            // go to ao3 jail do not pass go do not collect $200
                            // honestly tho if anyone ever submits so many comments that they'd get rate limited
                            // i'd just be impressed
                            alert("Rate limited. Sorry :(")
                        } else {
                            // .....less happy path
                            alert("Error - check console for details.")
                            console.log(xhr2)
                        }
                    }
                }

                //grabbing everything that we need in order to post the comment
                //for exampe, what's in the textfield
                const fd = new FormData()
                fd.set("comment[comment_content]", textinput.value)
                fd.set("tag_id", buttonset.parentElement.parentElement.firstElementChild.getElementsByTagName("label")[0].innerText);
                fd.set("controller_name", "comments")
                fd.set("comment[pseud_id]", pseud_id)

                //Copy auth token from the current page
                fd.set("authenticity_token", document.getElementsByName("authenticity_token")[0].value)
                xhr2.open("POST", "/comments")
                xhr2.responseType = "document"

                //And off we go!
                xhr2.send(fd)
                savebutton.textContent = "Commenting...";
            })

            //The cancel button
            const cancelbutton = document.createElement("button");
            cancelbutton.style.textAlign = "center"
            cancelbutton.textContent = "Cancel";
            cancelbutton.style.marginRight = "5px"

            //When the user clicks 'cancel,' we close out of the comment box
            cancelbutton.addEventListener("click", (e) => {
                if (newdiv.parentElement != null) {
                    document.body.removeChild(newdiv)
                }
            })

            //Adding cancel/save buttons to the same div and right justifying them
            buttondiv.appendChild(cancelbutton)
            buttondiv.appendChild(savebutton)
            buttondiv.style.textAlign = "right"
            buttondiv.style.marginTop = "5px"

            //Adding everything to the comment popup!!
            newdiv.appendChild(titlediv)
            newdiv.appendChild(commentFormatting)
            newdiv.appendChild(textinput)
            newdiv.appendChild(buttondiv)

            //This is the bizzare thing we have to do in order to get the ACTUAL tag ID that we need
            //when submitting the comment - see comments above savebutton.textContent lines for more details
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function xhr_onreadystatechange() {
                if (xhr.readyState == xhr.DONE ) {
                    if (xhr.status == 200) {
                        //THIS WAS AN ABSOLUTE PAIN
                        //AN. ABSOLUTE. PAIN.
                        //AN ABSOLUTE PAIN!!!!!!!! to figure out
                        //But the page is actually different if the user commenting has a pseud:
                        //If a user has pseuds, they'll see a dropdown menu (a "select" element) - if they don't, there is a hidden "input" element.
                        // the * will catch them both!
                        const pseud_id_elem = xhr.responseXML.documentElement.querySelector("*[name='comment[pseud_id]']")
                        pseud_id = pseud_id_elem.value
                        if (pseud_id_elem.tagName == "SELECT") {
                            //Makes a dropdown menu that lets the user select which pseud to comment from
                            const options = pseud_id_elem.options
                            const select = document.createElement("select")
                            array(options).forEach(o => {
                                const option = document.createElement("option")
                                option.value = o.value
                                option.innerText = o.innerText
                                select.prepend(option);
                            });
                            select.value = pseud_id_elem.value;
                            select.addEventListener("change", () => {
                                pseud_id = select.value;
                            });
                            commentFormatting.appendChild(select)
                        }
                        savebutton.textContent = "Comment";
                        savebutton.disabled = false;
                    } else {
                        alert("Something broke, sorry :( - check the console")
                        console.log(xhr)
                    }
                }
            }
            const comments_url = get_url(label).replace(/\/edit$/, "/comments")
            xhr.open("GET", comments_url)
            xhr.responseType = "document"
            xhr.send()

            document.body.appendChild(newdiv)

            //After the modal pops up, start with the textfield selected so you can type right away
            newdiv.querySelector("textarea").select()
        })
    }
    // Your code here...
})();