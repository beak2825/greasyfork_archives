// ==UserScript==
// @name         Dictapp Bot 0.2
// @namespace    https://example.com/
// @version      1.0
// @description  A bot to automate exercises on Rocaprevera.
// @author       Your Name
// @match        https://rocaprevera.dictapp.cat/students
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488002/Dictapp%20Bot%2002.user.js
// @updateURL https://update.greasyfork.org/scripts/488002/Dictapp%20Bot%2002.meta.js
// ==/UserScript==

// open the website in a new tab
open("https://rocaprevera.dictapp.cat/students")

// wait for the page to load
wait(5)

// click the "Iniciar" button
click(findElementByXPath("//button[contains(text(), 'Iniciar')]"))

// wait for the page to load
wait(5)

// select a random exercise category
click(findElementByXPath("//div[@class='col-md-3 col-sm-6 col-xs-12']/a"))

// wait for the page to load
wait(5)

// fill out the exercise form
fillOutForm(findElementByXPath("//form[@id='exercise-form']"))

// submit the form
click(findElementByXPath("//button[contains(text(), 'Enviar')]"))

// wait for the page to load
wait(5)

// close the tab
closeTab()

// function to fill out a form
function fillOutForm(form) {
    // get all the input fields in the form
    var inputFields = form.findElementsByTagName("input")

    // loop through each input field and fill it out with a random value
    for (var i = 0; i < inputFields.length; i++) {
        var inputField = inputFields[i]
        inputField.sendKeys(getRandomString(10))
    }
}

// function to generate a random string of a given length
function getRandomString(length) {
    // generate a random string of lowercase and uppercase letters and digits
    return Math.random().toString(36).substring(2, length + 2)
}