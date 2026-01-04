// ==UserScript==
// @name         Lunar client
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A Bloxd.io custom client.
// @author       Its_courruptedYT
// @match        https://bloxd.io/
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIREREQERISEBEREBEPEhERERESERIPGBQZGRgUGRkcIS4lHB4rHxgZJjgmKzAxNTU1GiQ7QzszPy40NTEBDAwMEA8QGBERGDQhGB0xMTExMTExPzExNDE/NDQ0MTE0MTE0NDExPzE0MTExNDExNDQ/NDE0MTQxMTExMTExMf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAAAQIDBAYHBQj/xABKEAACAQMBBAUGCgcFCAMAAAABAgADBBESBQYhMRNBUWFxByIygZGzNEJSU2JydJPR0hQjJZKhorEVNVSUwSQzY4KD4ePwFkRW/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAGxEBAQEAAwEBAAAAAAAAAAAAABEBEjFBIQL/2gAMAwEAAhEDEQA/AOR4hmRhNQp6oswhKCEISocIo5AQhCUEIR4gKEcMQFCPEMQCEeIoDhCEgIQhAIQhAI4hHAICEIBCEIFcIQgEJJGwQcA46jykYBCEIBCEcAjgJICUKGJICSAgQxDEsxHpkFeIYlmmGmBViGJYRIkSiEJLEWJAoRxQCEIQCOEIBCEIBCOECqEIQCEIQCPEMRgQpR4kgskFhEQJMCSCxhYCCxhZMLLETMCoLJBJ6ezdlVbh1p0qbVHbkiDJ8T2DvM6DsvyT12UNcVko5+Iimo4HeeAz4ZijlugaeR1Z59WnEgVnW9oeSRwCbe5RzjgtVCmT9Zc/0mgba2BXtH0XFNqbdRPFHHarDgRJVeCVkSsyHTErIlFRWIiTIkSIEcRSREiRAUIQiAzDMUIEswzFDMBwizCUQhJYhiZqwsQEeI8RSCMCMCSAikAEYWSCyxUihDJAGeAzgdmZNUlqUszZN3N1Lm+bFFP1YOGqvlaa+vrPcOMUjXqVuT1Tfd1vJzXudNS4zbUTxwR+udfoqfRHe3snQ92dyLWxxUI6euOPS1AMIfoLyXx4nvnu7S2jRtqZq16i0kHW55nsA5k9wioq2NsW2sk6O3pqg+M3N2PazHiZfebSoUP99WpUuvz3VeHgTOX7z+Ux21U7IGknLp3A6Rh9FeS+JyfCc6r3T1HLMzO7HJZiWdj4niZIPpG02xa1jppXFGo3yUqozezOZPaFhRuUalWprVRuasM8e0dYPeJ8zLcEEEEgjiCOYM3rdnykXFvpp3ObmkMDLH9cq9zfG8G9sQZu9fkxdNVWxJqpzNBz+sUdisfSHcePjOZ3No9NmR1ZGU4ZWBVgewg8p9K7F29bXqa7eqr49JD5rp9ZTxHjymLvHupa7QX9ammoBhayYFRfHqYdxij5qZJArN33p3FurHLlemoZ4VqYOAPprzTx5d8056ZE0MYiRIlxWVlYECIjJkSJECEI4SghCEAhDEIBCGYZmGzAjAkdUYaETAk1Egpk1EsKu4E8Bgdmcz0dm7OqV3WnSRqjtyRAST39w75nbo7u1NoXC0U81caqjkZCUxzbvPUB2md+2FsK3saQp29MLwGpyAajntZuv+kiVpO6/kzSnpqXxFRuYt0PmDudvjeAwO8zogFOjT4BKVNF5DSiKo/gBNb3k33trPUg/X1xw6NCNKn6bch4DJnKtv70XN83618U85WimVpr2cPjHvMI6BvH5RqdPVTs1FZ+XStnolP0Rzb+A8Zzi4r3e0a/E1Lms/oqMnA7lHBVHsmXuvu1V2hV0r5tNCDUqkZCjsA62PZO0bG2Lb2NLRRTSAMu5wXcjrZuv+kdD5825supaVegraekCI7qjatBbiEJ5asYPDtlm7G1KdrcpVq0UrINQOrXqTKkalwQM8esH1SO8V6bi5r1251Kjv4LnCj1KAPVPHYzQsuaodyy00pA8kp69C9w1En2mUB5FjI5gehZbQqUXV6btTdTlXRirA+qdQ3Y8qHo079c8h+kU14/86D+q+ycfBl9IMc6QTpBY4BOFGBk93Ee2TcH1JaXVKvTFSk6VabDgykMp7R/2ml70+Ti3udVW1021Y5JXH6lz4D0D3jh3Tk2w94LizfXb1GQnGpeaOOxlPAzrO7PlHt7nTTuQLaqcANnNFz4nip7jw75JByDbewa9o/R16bU246c8VcdqtyYTx2TE+qNobPo3VM066JVpsM4YA+DA9R7xOF7+boNs+qChL29XJpufSUjmjd47eseuXNGjMJEiXukqKykVGGJYVixFWIYjAjMICxCOECjMMxRwhySyAliwLFEvorxlCTKtxxEDunkj2ctOxavga69V8tjjoQ6QPDOo+uZflG3ga0t1pUmK1rjUocHDJTHpMOwnIAPjL/JkP2VbfWr++ead5XXP6XQGeAtlI8TUf8AATPo0W4oVAiVGBCVdehvlaGw38TMnYuzKl1WSggy7tpHYo62PcBky+72/c16FK2eozJT18z6eWBGrwxgTf8AyU7JASrdsOJPQUz2KMFyPHzR6jKN32NsqnaUUoUh5qDi3xmf4zN3mWbXcrbXDDmtCqw8QhMzZj3tHXSqJ8um6fvKR/rMj5nroWbABJPAADJJl+09g3FvSo1qlN1SujOCUcaMMV0tw4EgA8eowr60fKlkdDwZSVZWHYRyMy9rbyXVzRo0HrVClOmyPmo+KpLkhn4+cQCo49k2NaaVEzMS3Z2CorOx5KilmPgBxlm1dl1LWo9GtTZHQ485WAbkcqTzHGB54M2Hd3bqWiXSNb0axr2z0laohdgzMp0txGU83JHPIE8CMNAudsknAGSTgDAHcJZTciUBpNTA7D5Kd4mfNhVYtpU1KDE5IUelT8BzHr7ptW/tgtfZt0GGTTpm4Q9avTGrI9QI9c5L5NWI2na462qj1dE87XvH8CvPslx7ppnR8yV1wTMZplXPOYrTSoNI5kjImAoQjgKEcIGNHFHCGJNZASxYFizJt+YlCLMu3TiII+g/Jn/dVt41/fPNM8r3wuj9lX3jzc/JqP2XbfWr++ead5XPhdH7MvvKkz6NBoJkzv8AufailYWqYwTSVz9Z/OP9ZwS35z6I2Lj9Ftscv0eljw0CNGdFHCQcI372Z+j3tZAMI7dMn1X4/wAG1D1TUagndvKBsE3dv0lMZrUAzAAcXp/GQd/WP+84ncUcGawYCVGRg6MyMOIZGKsD2gjiJZtbaNW7qvWrOzu5zxZiFGMYUE8B3ROkzNjbGqXdanQpqxLuELhSy0webMRyAEo8QiNRMu9sqlF2SojI6kgq6lTkHHXKqIXUNYJXI1BSFYjrAJBAPqMC612fUqJVdFJSggqVD8lS6oP4sPYZTpxOtboV9kfoO0NFOuqCghu1rMrO1PzgoQrgc89nEic5221oX/2RK6U/+PUpuxPcFXh6yZKPb8mn952n16nunnbd4/gV59kuPdtOJ+TX+87T69T3Tztm8fwK8+yXHu2k3sfM1zzmKRMu5HGYrTSxWRIGWGQMKRhCEAhCEIx0TPXiSCQEkJFNVEsEgJIQLVmVb8xMRZlW54iIlfQfk1/uu2+tX98803yu/DKP2VfeVJuXk1/uu2+tX98807yuD/a6P2VfePJnaNEoHjO87mXQq7PtmByVQUj3Mh0/6CcXs9kO9rVuwDopVKdM8OevVk+rzf3pvvkv2qB0lox9L9dT7yBh19mD6jLo6TCEJkE5pvzuWSWurVcg5arRUcQet1HWO0TpcIHzNWtyJlbE2xWsqyVKb1AqurvTV2VKijmrAcDw7Z2XeDcq3u9TqOgrHiXUDS5+kv8AqMGc82ruHeUScU+mT5dI6v5fSHsmqjTto3lW4cvWqPVYknLuz4BOcDJ4DumFpntXGyqiHD06iH6aMv8AUShNnVGOFRmPYqsT/CVWHRualNXRWIWogSoByZA6uAfWolJE2W03Ovao1LbuiAFmeqOiRVAyWJfHDwzPAdMHnnjzHI98K2bybj9p2v1qnunnbN4vgV59luPdtOLeTgftO1+tU9087TvF8CvPstx7tpnUfM9xzmK0y7nnMRpppWZAybSDGAjFAmKIhwihEFQMYMiJIRmIkDJqZWJYsFWLMq35iYqT1tk7Mr3LMtClUrFAGYU0LFQTgE45SjvHkzP7KtvGv755p/lXcre0COYtlI5HiKlTtmRu3tbadlaU7VdmVX0GodbrUGdTs/IL9LHOeVvLbbS2hVStUsqqFEFMBKVXGkMzZOevzjMeidjvzcJZ1aRqDpw9NaL9HTGKRB1jAXBxpHMfG7p4VptSotdbgPiqrBtQCr53gABxli7r3v8AhK/3bS5N2bwf/Vr/AHbzXwdj2DteneUVqoQGwBUTPFKmOKnu7D1ierOSbAtdo2lQVEt63Y6Gm+l1zyP49U6fs+7NVAxpvSbrSopVge7tHfM6MyEISAixHCBEqDzGfGIKB1AeoSU1zeXatyimnaUKr1CMGqKbFE+r8pv4Dvga/wCUneQLTaxpNl3H69lPop834nr7vGckcTarnd2+dizW1wxYkklHJJPMk9sxW3Vvf8JX+7eaxV/k7H7StfrVPdPOzbxfArz7Lce7ace2LsnaFpcU7lLOs70yxCvSqaTlSvHHHkZtt/vHtOrb1aLbLq5q0qlIlVqDSHQrqAIOefKRHHLk8Zhu09Xa+za9uyivSqUS4LKKiFCwHAkZnkNNRagxkDJNIEyoIoExQHCLMIRUJISIjkVMSaysSYMotWbfuMGNSrp2iuzPMTNRm09L5x830hy5+uacpno7KrIlWm9SmaqI6NUpgkF0B4rnqyJB1pKb/wD6Smf+p/5JutrvBZqlNGvaDsqKrP0qZdgAC3PrPGctp7w7J6tjOP8AqvM+ntPZ5ZUXY1RnfOlErF3OACfNUkjAIPHtmYOsW9wlRFqU2V0b0WUgqeOOBl80Sx3qeii0qeyrxETIVQjkAEk9a9pM9zYe3nuqjI1pXtgqF9dVWCk6gNIyBx459UkHvwijgEIQgEIQgEIQgEg7hQWJwACSTyAHMzx9vbae16PRbVrnpNeeiBOjTp54B56v4GeHV3zqsrKdmXhDAqRobiCMEejLBsJ3ksf8Xb/ep+M0vaLGpVqOm8FOkjuzLTFTgik8FHn9U8mttTZ6MUfY1SmyqHIq1jSIQnAPnkdfCYVfb2ylJVtjVMqSCOmY8R3gy5g8PfkMHpatortPKPh1bV0XnDzfSPPn6pp7Gejtq4R69R6VM0KTuWSkSSUT5OeueYxlxCJkDJGRlChHiPEVUcQk8QiiiEISBiSEjmMGBYJl2dd1bCEAuVHHlz4f1mEDLaOk51Ejlj/XqMuD2qd3XHxh93V/LM2w2jc0qiVaVQUqia8OlGpnLgBicockgDnNfVafyz7W/JLddPK5xjzs6NfYNOc8+OfbNDfE3xvwAGurx2x5xShQCZ7BqQGXf/NLtRqe4v1HLJo2oGfEpNIppTIBCVCDyIVyJfoXSyotRdeASadRuAOeXiBJxwbku/dX/F3n3dn+WbDse9vq5dztKkiU7l6JSsaSO6owycBesTlK2nfV/wAvU/GZ1K+BYK1SmzkhMvZ03fPLzi3EnxmeI+hhtO3+fo/ep+MP7Tt/n6P3qfjPnRts1ASNFvwJHwW26v8AkjG3KnyKH+VtvyScR9Ff2nb/AD9H71Pxgdp2/wA/R+9T8Z86/wBt1PkW/wDlbb8ki226nyKH+VtvyRxHVN47u9pLc3NLaVv0aaqiUVamz6c8FHm8Tia7e751qVR6Zu7tmQ6SVp2YUnA5ZWancXwVirVKIZTg6bKjwbuOJh1bYuSxaqxY6ixt3OSevnLn5G4DfW6cEpc3zAcCVpWhAPqWVNvjfZx+lXydWpqFsQO8gJmaqlHCaGSq4DMwxRqKQSAD4+iJW9BPm6o8UqTWZiM/aW0Lu4c1LiqK7lFpkvRf0FbUBgIBzmA91W5ahgdQp1AMfuzCLpk6cAaRjWGI1auPLjykWWmSTqxnjgM2B4eZNCN7Vdmw5BK5HDvmKZdXVBjQ2rnnnw9oEpMxurCxDEeYsyAjkcwzC1KEjmERKphCEAjEUIEhJo+CDzwc4lZxw55640bBB7DmBlC67v4yxLongB/MBMcV2/8AS34ySuzkAHBGTkFs46+M0RkM+o5KqTy/3g5e2DgaScBTwxhw2TnljPZKwtT5Z/eeWJUdQSWc9gV3HHMsFase+ekl5jOH0gsz4K1MgtxI80jMwhdP2VfvKksWuQxzVcaXPml29EHhmMw+LhUp9tP9yt+aSFWl/wAP9yt+aeey5JOtOJJ5t+EXR/TT2t+EhXpdPS7Kf7lb88RuKfZT/crfnnndH9NPa34Q6P6ae1vwhK9V9oZUprUKylDhKx80jqyxEwLm4Luz4I1HPfiSq186mFVgcZCq7YzjkIVK7AkAVTjr6Spxl3ClTwVzgM2oghnCYGBjx6/ZGCQQQigjkemHP2yDO7AYNRDk5DPUORwwf6yB6T5bfvPLBZUumXmo4jPBgRjxEjUusHHBuRyrcOXhKjVdDxOSRzJbOM8ucj+lt/6z/jII1H1EnGMnOBIZg7liSeZkZkOEUcAhHCAQhCBTCAEejtkUoBZLgIFoUBIAiLMUJUi0A0jCUT1ntPtMNZ7T7TIRwifSHtPtMtpsvAtnUDnnw7uoygQzLRk9KfnD/PDpT84f55j5hLRkdKfnD/PDpD84fa8x44oyKjoctx1HjwJxq9kq1ntPtMhCSiWs9p9phrPafaYoYkqg98UeI4IUcI4IWIYksQghAR4hDMgMQhCFUlpHMMR4gKEliGIRGOSxDEpEcQxJYjxBEI5LEeIIhiPEliGIpEcQxJQgLEMRxwpQjxDEAhHCQEIQlBCGYi0CUJDVEWhKshmVZhmBZrhK4QEI4QkU4QhAcUISqccIQFCEJEEIQlBCEIDEcIQCEISBiKEIAZEwhLhqJiMISoIQhIYUYhCA4QhCv//Z
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486911/Lunar%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/486911/Lunar%20client.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Define Main Menu
    let clientMainMenu;
    clientMainMenu = document.createElement("div");
    clientMainMenu.textContent ="Lunar client";
    clientMainMenu.style.position = "fixed";
    clientMainMenu.style.color = "#ffffff";
    clientMainMenu.style.top = "50%";
    clientMainMenu.style.left = "50%";
    clientMainMenu.style.transform = "translate(-50%, -50%)";
    clientMainMenu.style.zIndex = "10000";
    clientMainMenu.style.borderRadius = "10px";
    clientMainMenu.style.backgroundImage = "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7-wKwbIWcs1Pw92CfTZKoaimAav4AfRl27w&usqp=CAU)";
    clientMainMenu.style.backgroundRepeat = "no-repeat";
    clientMainMenu.style.backgroundSize = "cover";
    clientMainMenu.style.backgroundPosition = "center";
    clientMainMenu.style.boxShadow = "0px 0px 20px rgba(0, 0, 0, 0.5)";
    clientMainMenu.style.fontSize = "24px";
    clientMainMenu.style.height = "650px";
    clientMainMenu.style.width = "1200px";
    clientMainMenu.style.textAlign = "center";
    clientMainMenu.style.lineHeight = "50px";
    clientMainMenu.style.visibility = "hidden";
    clientMainMenu.style.opacity = "100%";
    clientMainMenu.style.userSelect = "none";


    // Define Button Elements
    let wkey;
    wkey = document.createElement('div');
    wkey.style.position = "relative";
    wkey.style.color = "#ffffff";
    wkey.textContent = "W";
    wkey.style.top = "0px";
    wkey.style.left = "0px";
    wkey.style.zIndex = "10000";
    wkey.style.fontWeight = "bold";
    wkey.style.borderRadius = "10px";
    wkey.style.backgroundColor = "#66ccff";
    wkey.style.fontSize = "48px";
    wkey.style.height = "50px";
    wkey.style.width = "50px";
    wkey.style.textAlign = "center";
    wkey.style.lineHeight = "50px";
    wkey.style.filter = "blur(1px)";


    let skey;
    skey = document.createElement('div');
    skey.style.position = "relative";
    skey.style.color = "#ffffff";
    skey.textContent = "S";
    skey.style.top = "5px";
    skey.style.left = "50%";
    skey.style.transform = "translateX(-50%)";
    skey.style.zIndex = "10000";
    skey.style.fontWeight = "bold";
    skey.style.borderRadius = "10px";
    skey.style.backgroundColor = "#66ccff";
    skey.style.fontSize = "24px";
    skey.style.height = "50px";
    skey.style.width = "50px";
    skey.style.textAlign = "center";
    skey.style.lineHeight = "50px";
    skey.style.filter = "blur(1px)";

    let akey;
    akey = document.createElement('div');
    akey.style.position = "relative";
    akey.style.color = "#ffffff";
    akey.textContent = "A";
    akey.style.top = "60px";
    akey.style.left = "46.3%";
    akey.style.transform = "translateX(-50%)";
    akey.style.zIndex = "10000";
    akey.style.fontWeight = "bold";
    akey.style.borderRadius = "10px";
    akey.style.backgroundColor = "#66ccff";
    akey.style.fontSize = "24px";
    akey.style.height = "50px";
    akey.style.width = "50px";
    akey.style.textAlign = "center";
    akey.style.lineHeight = "50px";
    akey.style.filter = "blur(1px)";

    let dkey;
    dkey = document.createElement('div');
    dkey.style.position = "relative";
    dkey.style.color = "#ffffff";
    dkey.textContent = "D";
    dkey.style.top = "60px";
    dkey.style.left = "53.7%";
    dkey.style.transform = "translateX(-50%)";
    dkey.style.zIndex = "10000";
    dkey.style.fontWeight = "bold";
    dkey.style.borderRadius = "10px";
    dkey.style.backgroundColor = "#66ccff";
    dkey.style.fontSize = "24px";
    dkey.style.height = "50px";
    dkey.style.width = "50px";
    dkey.style.textAlign = "center";
    dkey.style.lineHeight = "50px";
    dkey.style.filter = "blur(1px)";

    let lmb;
    lmb = document.createElement('div');
    lmb.style.position = "relative";
    lmb.style.color = "#ffffff";
    lmb.textContent = "LMB";
    lmb.style.top = "115px";
    lmb.style.left = "50%";
    lmb.style.transform = "translateX(-50%)";
    lmb.style.zIndex = "10000";
    lmb.style.fontWeight = "bold";
    lmb.style.borderRadius = "10px";
    lmb.style.backgroundColor = "#66ccff";
    lmb.style.fontSize = "18px";
    lmb.style.height = "50px";
    lmb.style.width = "50px";
    lmb.style.textAlign = "center";
    lmb.style.lineHeight = "50px";
    lmb.style.filter = "blur(1px)";

    let rmb;
    rmb = document.createElement('div');
    rmb.style.position = "relative";
    rmb.style.color = "#ffffff";
    rmb.textContent = "RMB";
    rmb.style.top = "115px";
    rmb.style.left = "53.7%";
    rmb.style.transform = "translateX(-50%)";
    rmb.style.zIndex = "10000";
    rmb.style.fontWeight = "bold";
    rmb.style.borderRadius = "10px";
    rmb.style.backgroundColor = "#66ccff";
    rmb.style.fontSize = "18px";
    rmb.style.height = "50px";
    rmb.style.width = "50px";
    rmb.style.textAlign = "center";
    rmb.style.lineHeight = "50px";
    rmb.style.filter = "blur(1px)";

    // Add the elements to the body and the clientMainMenu
    //document.body.appendChild(wkey);
    //document.body.appendChild(skey);
    //document.body.appendChild(akey);
    //document.body.appendChild(dkey);
    //document.body.appendChild(lmb);
    //document.body.appendChild(rmb);
    document.body.appendChild(clientMainMenu);

    // Add Event Listeners for the Keybinds

    document.addEventListener('keydown', function(event) {
        if (event.key === 'w') {
            wkey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 's') {
            skey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 'a') {
            akey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 'd') {
            dkey.style.backgroundColor = "#3366ff";
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'w') {
            wkey.style.backgroundColor = "#66ccff";
        }
        if (event.key === 's') {
            skey.style.backgroundColor = "#66ccff";
        }
        if (event.key === 'a') {
            akey.style.backgroundColor = "#66ccff";
        }
        if (event.key === 'd') {
            dkey.style.backgroundColor = "#66ccff";
        }
    });

    document.addEventListener('mousedown', function(event) {
        if (event.button === 0) {
            lmb.style.backgroundColor = "#3366ff";
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = "#3366ff";
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 0) {
            lmb.style.backgroundColor = "#66ccff";
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = "#66ccff";
        }
    });

    // Define Main Menu dragging

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    clientMainMenu.addEventListener('mousedown', function(event) {
        if (event.target.nodeName !== 'INPUT') {
            isDragging = false;
            offsetX = event.clientX;
            offsetY = event.clientY;
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const left = event.clientX;
            const top = event.clientY;

            clientMainMenu.style.left = left + "px";
            clientMainMenu.style.top = top + "px";
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'L' || event.key === 'l') {
            clientMainMenu.style.visibility = clientMainMenu.style.visibility === "hidden" ? "visible" : "hidden";
        }
    });

    // Define imputs and main menu text

    let clientheader
    clientheader = document.createElement("div");
    clientheader.textContent = "Made By Its_courruptedYT";
    clientheader.style.position = "absolute";
    clientheader.style.top = "20px";
    clientheader.style.left = "50%";
    clientheader.style.transform = "translateX(-50%)";
    clientheader.style.fontSize = "15px";
    clientMainMenu.appendChild(clientheader);

    // Create the button element
    const discordbutton = document.createElement("div");
    discordbutton.style.position = "absolute";
    discordbutton.style.top = "60px";
    discordbutton.style.left = "50%";
    discordbutton.style.transform = "translateX(-50%)";
    discordbutton.style.cursor = "crosshair";
    discordbutton.style.backgroundColor = "#3e473f";
    discordbutton.style.color = "#000000";
    discordbutton.style.borderRadius = "10px";
    discordbutton.style.height = "25px";
    discordbutton.style.padding = "8px";
    discordbutton.addEventListener("click", function() {
        window.location.href = "https://discord.gg/tJJasV2SHe";
    });

    // Create the text element
    const discordButtonText = document.createElement("div");
    discordButtonText.textContent = "Join The Discord Server";
    discordButtonText.style.fontSize = "15px";
    discordButtonText.style.textAlign = "center";
    discordButtonText.style.top = "50%";
    discordButtonText.style.transform = "translateY(-25%)";

    // Append the text element to the button element
    discordbutton.appendChild(discordButtonText);

    // Append the button element to the desired parent element
    clientMainMenu.appendChild(discordbutton);


    let clientsettingstext;
    clientsettingstext = document.createElement("div");
    clientsettingstext.textContent = "- Client Settings -";
    clientsettingstext.style.position = "absolute";
    clientsettingstext.style.top = "150px";
    clientsettingstext.style.left = "50%";
    clientsettingstext.style.transform = "translateX(-50%)";
    clientsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(clientsettingstext);

    let clientsettingsinput
    clientsettingsinput = document.createElement("input");
    clientsettingsinput.type = "text";
    clientsettingsinput.placeholder = "client background url";
    clientsettingsinput.style.position = "absolute";
    clientsettingsinput.style.top = "160px";
    clientsettingsinput.style.left = "50%";
    clientsettingsinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(clientsettingsinput);

    clientsettingsinput.addEventListener('input', function() {
        clientMainMenu.style.backgroundImage = `url(${clientsettingsinput.value})`;
    });

    clientsettingsinput.addEventListener('mousedown', function(event) {
        event.stopPropagation();
    });

    let hotbarsettingstext;
    hotbarsettingstext = document.createElement("div");
    hotbarsettingstext.textContent = "- HotBar Settings -";
    hotbarsettingstext.style.position = "absolute";
    hotbarsettingstext.style.top = "220px";
    hotbarsettingstext.style.left = "50%";
    hotbarsettingstext.style.transform = "translateX(-50%)";
    hotbarsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(hotbarsettingstext);

    let hotbarmaincolorinput
    hotbarmaincolorinput = document.createElement("input");
    hotbarmaincolorinput.type = "color";
    hotbarmaincolorinput.value = "#3d4b79"
    hotbarmaincolorinput.style.top = "250px";
    hotbarmaincolorinput.style.marginTop = "10px";
    hotbarmaincolorinput.style.position = "absolute";
    hotbarmaincolorinput.style.left = "44%";
    hotbarmaincolorinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(hotbarmaincolorinput);

    hotbarmaincolorinput.addEventListener("input", function() {
        const color = hotbarmaincolorinput.value;
        hotbarmaincolorinput.value = color;
        const hotbars = document.querySelectorAll(".item");

        hotbars.forEach(function(hotbar) {
            hotbar.style.backgroundColor = color;
        });
    });

    let hotbarbordercolorinput;
    hotbarbordercolorinput = document.createElement("input");
    hotbarbordercolorinput.type = "color";
    hotbarbordercolorinput.style.top = "250px";
    hotbarbordercolorinput.value = "#303a59";
    hotbarbordercolorinput.style.marginTop = "5px";
    hotbarbordercolorinput.style.position = "absolute";
    hotbarbordercolorinput.style.left = "56%";
    hotbarbordercolorinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(hotbarbordercolorinput);

    hotbarbordercolorinput.addEventListener("input", function() {
        const color = hotbarbordercolorinput.value;
        hotbarbordercolorinput.value = color;
        const hotbars = document.querySelectorAll(".item");

        hotbars.forEach(function(hotbar) {
            hotbar.style.borderColor = color;
        });
    });

    let hotbarborderradiusinput;
    hotbarborderradiusinput = document.createElement("input");
    hotbarborderradiusinput.type = "range";
    hotbarborderradiusinput.style.top = "280px";
    hotbarborderradiusinput.style.marginTop = "5px";
    hotbarborderradiusinput.style.position = "absolute";
    hotbarborderradiusinput.value = "0";
    hotbarborderradiusinput.style.left = "50%";
    hotbarborderradiusinput.min = "0";
    hotbarborderradiusinput.max = "50";
    hotbarborderradiusinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(hotbarborderradiusinput);

    hotbarborderradiusinput.addEventListener("input", function() {
        const hotbarrounding = hotbarborderradiusinput.value;
        const hotbars = document.querySelectorAll(".item");

        hotbars.forEach(function(hotbar) {
            hotbar.style.borderRadius = hotbarrounding + "px";
        });
    });

    let crosshairsettingstext
    crosshairsettingstext = document.createElement("div");
    crosshairsettingstext.textContent = "- Crosshair Settings -";
    crosshairsettingstext.style.position = "absolute";
    crosshairsettingstext.style.top = "320px";
    crosshairsettingstext.style.left = "50%";
    crosshairsettingstext.style.transform = "translateX(-50%)";
    crosshairsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(crosshairsettingstext);

    let crosshairsettingsinput;
    crosshairsettingsinput = document.createElement("input");
    crosshairsettingsinput.type = "text";
    crosshairsettingsinput.placeholder = "Crosshair URL";
    crosshairsettingsinput.style.position = "absolute";
    crosshairsettingsinput.style.top = "360px";
    crosshairsettingsinput.value = "https://piskel-imgstore-b.appspot.com/img/15ed6123-c3a5-11ee-9501-c7b63267fd1e.gif";
    crosshairsettingsinput.style.left = "50%";
    crosshairsettingsinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(crosshairsettingsinput);

    let crosshairurl;

    crosshairsettingsinput.addEventListener('input', function() {
        const crosshair = document.querySelector(".CrossHair");
        if (crosshair) {
            crosshair.style.backgroundImage = `url(${crosshairsettingsinput.value})`;
            crosshairurl = `url(${crosshairsettingsinput.value})`;
        }
    });

    crosshairsettingsinput.addEventListener('mousedown', function(event) {
        event.stopPropagation();
    });

    let keybindsettingstext;
    keybindsettingstext = document.createElement("div");
    keybindsettingstext.textContent = "- Keybind Settings -";
    keybindsettingstext.style.position = "absolute";
    keybindsettingstext.style.top = "420px";
    keybindsettingstext.style.left = "50%";
    keybindsettingstext.style.transform = "translateX(-50%)";
    keybindsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(keybindsettingstext);

    setInterval(function() {
        const color1 = hotbarmaincolorinput.value;
        const color2 = hotbarbordercolorinput.value
        const hotbarrounding = hotbarborderradiusinput.value;
        const hotbars = document.querySelectorAll(".item");
        hotbars.forEach(function(hotbar) {
            hotbar.style.borderRadius = hotbarrounding + "px";
            hotbar.style.borderColor = color2;
            hotbar.style.backgroundColor = color1;
        });
        const crosshair = document.querySelector(".CrossHair");
        if (crosshair) {
            crosshair.textContent = "";
            crosshair.style.backgroundImage = crosshairurl; // Use the crosshairurl variable here
            crosshair.style.backgroundRepeat = "no-repeat";
            crosshair.style.backgroundSize = "contain";
            crosshair.style.width = "30px";
            crosshair.style.height = "30px";
        }
    }, 1000);
})();