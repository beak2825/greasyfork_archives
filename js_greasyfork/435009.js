// ==UserScript==
// @name         ELSS Auto reg
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.lc.cityu.edu.hk/Booking/EventManagement/EventRegistration*
// @icon         https://www.google.com/s2/favicons?domain=edu.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435009/ELSS%20Auto%20reg.user.js
// @updateURL https://update.greasyfork.org/scripts/435009/ELSS%20Auto%20reg.meta.js
// ==/UserScript==

(function() {


    var magicCourseCode = "";


    // Magic Btn
    var newele = document.createElement("a")
    newele.innerHTML = "Magic"
    newele.classList.add("navbar-brand")
    newele.onclick = () => {addBtns()}
    newele.style.cursor = "pointer"
    document.getElementsByClassName("navbar-header")[0].appendChild(newele)

/*    // Save Btn
    var saveBtn = document.createElement("a")
    saveBtn.innerHTML = "Save"
    saveBtn.classList.add("navbar-brand")
    saveBtn.onclick = saveBtnFunc
    saveBtn.style.cursor = "pointer"
    document.getElementsByClassName("navbar-header")[0].appendChild(saveBtn)  */

    // Text box
    var newTextBox = document.createElement("input")
    newTextBox.classList.add("navbar-brand")
    newTextBox.type = "text"
    newTextBox.placeholder = "Course Code Here"
    newTextBox.style = `
        padding: 0px;
        background: inherit;
        border: none;
        margin-left: 1px;
        margin-top: 1px;
    `
    document.getElementsByClassName("navbar-header")[0].appendChild(newTextBox)

    if (isCourseCodeStored()) {
        newTextBox.value = getCourseCode()
        magicCourseCode = getCourseCode()
    }

    newTextBox.onchange = () => {
        setMagicCourseCode()
    }


    function addBtns(){

        if (magicCourseCode == "") {
            alert("Input a Course Code First!");
            return false;
        }

        total = document.getElementsByClassName("Item").length
        for(var i=0; i<total; i++){
            let original = document.getElementsByClassName("Item")[i].innerHTML
            document.getElementsByClassName("Item")[i].innerHTML = `<button id='btn${i}' style="color: black;border-radius: 10px">Reg</button>` + original
        }


        for(let i=0; i<total; i++){
            document.getElementById(`btn${i}`).onclick = () => {
                delOther(i)
                setTime(i)
            }
        }
    }

    function setTime(courseNum){

        var availHr, availMin

        interval3 = setInterval(()=>{
            if(document.getElementById("mdlRegisterEvent").getAttribute('aria-hidden') == "true"){
                document.getElementsByClassName("Item")[courseNum].click()
            } else {
                if(document.getElementsByClassName("modal-header")[0].children[2]
                &&
                document.getElementsByClassName("modal-header")[0].children[2].className.indexOf("warning") != -1){

                    availHr = parseInt(document.getElementsByClassName("modal-header")[0].children[2].children[0].innerText.split(" ")[1].split(":")[0])
                    availMin = parseInt(document.getElementsByClassName("modal-header")[0].children[2].children[0].innerText.split(" ")[1].split(":")[1])

                    setSrartInterval(courseNum ,availHr, availMin)

                    clearInterval(interval3)
                    console.log(`Auto Reg will be started at ${availHr}:${availMin}`)

                } else{
                    clearInterval(interval3)
                    setAutoReg(courseNum)

                }
            }

        },500)

    }

    function setSrartInterval(courseNum, hr, min){

        var now = new Date()

        interval4 = setInterval(()=>{

            var diff = new Date(now.getFullYear(), now.getMonth(), now.getDay(), hr ,min) - Date.now()- 5000
            if(diff < 0){
                setAutoReg(courseNum)
                clearInterval(interval4)
            }else{
                console.log(`We still have ${diff} left`)
            }
        }, 500)
    }


    function delOther(except){
        total = document.getElementsByClassName("Item")
        for(var i=0; i<total.length; i++){
            if(i != except){
                total[i].style.display = "none"
            }
        }
    }


    function setAutoReg(courseNum){
        interval = setInterval(()=>{
            if(document.getElementById("mdlRegisterEvent").getAttribute('aria-hidden') == "true"){
                document.getElementsByClassName("Item")[courseNum].click()
            } else {
                if(document.getElementsByClassName("modal-header")[0].children[2]
                &&
                document.getElementsByClassName("modal-header")[0].children[2].className.indexOf("warning") != -1){
                    document.getElementsByClassName("modal-header")[0].children[0].click()
                } else{
                    clearInterval(interval)
                    regCourse(courseNum)

                }
            }

        },100)
    }





    function regCourse(retryNum){
        interval2 = setInterval(()=>{

            if(document.getElementById("btnRegister")){
                try{
                    document.getElementById("coursecode").value = magicCourseCode
                    document.getElementById("studentlog").selectedIndex = 1
                }
                catch{}

                try{
                document.getElementById("btnRegister").click()
                }
                catch{
                    clearInterval(interval2)
                    setAutoReg(retryNum)
                }
                clearInterval(interval2)
            }
            else {
                clearInterval(interval2)
                setAutoReg(retryNum)
            }
        }, 200)
    }

    function isCourseCodeStored() {
        if (localStorage.getItem("magicCourseCode") == void 0) return false;
        else return true;
    }

    function getCourseCode() {
        return localStorage.getItem("magicCourseCode");
    }

    function getMagicInputBoxVal() {
        return newTextBox.value
    }

    function storeCourseCode() {
        localStorage.setItem("magicCourseCode", getMagicInputBoxVal())
    }

    function setMagicCourseCode() {
        const magicInputBoxVal = getMagicInputBoxVal();
        storeCourseCode();
        magicCourseCode = magicInputBoxVal
    }

/*    function saveBtnFunc() {
        setMagicCourseCode();
        alert(`Saved. The Magic Course Code is ${magicCourseCode}`)
    }
*/


})();