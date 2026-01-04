// ==UserScript==
// @name         Florr.io build selector
// @version      1.0.0
// @description  Create, Apply and Delete builds for florr.io
// @author       Benur21
// @match        https://florr.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=florr.io
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/994732
// @downloadURL https://update.greasyfork.org/scripts/456301/Florrio%20build%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/456301/Florrio%20build%20selector.meta.js
// ==/UserScript==

const firebaseEndpoint = ""; // paste your own firebase realtime database url here, remove the slash at the end

const icons = {
    pasteImageIcon: "data:image/png;base64,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kroNQFHk3sykzjN79uy4Zs2aGACoee3t7XHevHm+BksqIQBFkXszE4kNDQ3xwx/+sGINUKMeffTReOWVV8aGhobsZ47IywEoitybmcjv5Pzzz4933nln7OvriwGAqrZ8+fJ42WWXebVbKjEARZF7MxN5zUyfPj1+5StfiZ2dnTEAUDUOHjwYFy9eHN/2trdlP0tEXicARZF7MxN53YwfPz5+4hOfiI899lgMAFSsJ554In7yk5+MEyZMyH52iBxFAIoi92YmctQ59dRT40033RT37NkTAwDZvfjii3Hx4sVx9uzZ2c8IkUEGoChyb2Yig86IESPiVVddFX/wgx/E7u7uGAAom56envijH/0oXn311bG1tTX7mSCSGICiyL2ZiQwpI0aMiJdddllcvHhx7OjoiAGAouvu7o533313nDdvXhw9enT2vV+kCAEYskKwoVBDWltbw9y5c8PcuXPDnDlzwvTp0wu5ZwKoVps2bYrLli0LP/nJT8K9994buru7c48ExeQaARgyhZqaNm3atDB79uzfZPz48Q5PgCPo7OyMbW1t4f777w/3339/WLNmTe6RoJRcEwBDplBTNxobG8Nb3/rWcMYZZ4QzzjgjXHDBBeH0008PjY2NDlSgLm3cuDH+4he/CGvWrAlr1qwJv/rVr8Lhw4dzjwXl4vwHhkyhpq6NGTMmnH322eH0008PM2fODG9729vCKaecEkaPHu2QBWpGR0dHfPrpp0N7e3tYu3Zt+PWvfx1WrVoVXnzxxdyjQU7OemDIFGp4DVOnTg0zZ84Mp5xySjjppJPCiSeeGKZMmRJOPPHEcPzxxzuAgYrzwgsvxOeeey68kmeffTY8/fTTYe3atWHLli25x4NK5DwHhkyhhkFqaWkJJ554YjjuuOPC+PHjw7hx48L48eN/5783NzeHxsbGMHr06BBCCE1NTWHUqFGZJweqwUsvvRT6+vpCCCF0dHSE/v7+cPjw4bB///6wb9++V/3nrl27wnPPPRcOHjyYeXKoOgo1MGQKNQAA9UihBoasIfcAAAAAUI0UagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAAIIFCDQAAAAkUagAAAEigUAMAAEAChRoAAAASKNQAAACQQKEGAACABAo1AAAAJFCoAQAA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/vCHzsTERJw4cSLPtwEAgBgZGYm//OUvsWzZMkENFCKXK9TnjY+Pt44cORKDg4N5vg0AAMQ3vvENMQ0UqpADzi9/+cvOrl274vTp00W8HQAADfP+978/fvWrX3kYGVCowg44R48e7dx9990xPT1d1FsCANAA7XY7jh49GrfeequYBgqV6y3fb/WBD3yg9eSTT8bw8HBRbwkAQAPs379fTANJFH7gOX78eGdycjJefvnlot8aAICaGR8fj2PHjsXb3vY2QQ0UrrAr1OfdfPPNrWeeeSY2b95c9FsDAFAjS5YsiR/84AdiGkim8KCOiBgdHW099dRTcdttt6V4ewAAauA73/lObN68WUwDySQJ6oiIoaGh1i9+8Yv4+Mc/nmoFAAAq6v777499+/aJaSCpUhyEDhw40Pnc5z4X586dS70KAAAlt2fPnvjhD38YPT09pTiXBZqrNAehw4cPdz72sY/FiRMnUq8CAEBJ7dy5M37yk5/ENddcU5rzWKC5kt3yfampqanWs88+G7fcckvqVQAAKKF77rknDh06JKaB0ihNUEdE3Hjjja2nn346HnjggWi3S7UaAAAJfeITn4hHH33UE70BunHkyJHOmjVrOhFhjDHGGGMaOj09PZ2vfvWrnTfeeKMTACVT6v/hO3HiRGf//v1x8ODB1KsAAFCwkZGReOSRR+L2228v9Tkr0Fylvq965cqVrYMHD7Z+/vOfx7p161KvAwBAQXbv3h2//e1vxTRQaqUO6vN27drV+uMf/xj79++Pvr6+1OsAAJCTDRs2xE9/+tP48Y9/3LruuuvENECWnn/++c5dd92V/Pt5jDHGGGNMdjM4ONh58MEHO//97387AUC+Dh061Ln55puTH/yNMcYYY8zC5/rrr+88+OCDnddee60TABRnZmam8+ijj3Y2btyY/IuBMcYYY4zpfsbGxjrf/va3O//61786AUA6Z8+e7Tz88MOdm266KfkXB2OMMcYYM/ds3Lix8/3vf79z5syZTgBQHm+88UbnZz/7WWfnzp3Jv1gYY4wxxpg3p6enp/PhD3+4c+jQoc7MzEwnAGqitk9O/P3vf9956KGH4pFHHomTJ0+mXgcAoHHWrl0be/fujU996lOxdu3a2p53As1V+wPb66+/3nn88cfj4YcfjieffDLOnTuXeiUAgNpasmRJ3HnnnfHpT386du3aFb29vbU/3wSaq1EHuBMnTnQOHToUjz32WBw+fDjOnDmTeiUAgMpbunRpTExMxJ49e2L37t0xMDDQqHNMoLkae7A7depU54knnojDhw/H4cOH4+9//3vqlQAAKmP9+vUxNTUVH/nIR+L222+P/v7+xp5XAs3lwPc/f/vb3zpHjx6NX//61/H000/H8ePH3R4OABARK1eujC1btsSWLVti27ZtsWPHjlizZo3zSKDxHAjncPr06c7zzz8fx48fjz/96U9x/PjxeOGFF+LFF1+M//znP6nXAwDIxNDQUAwNDcWqVatiZGQkxsbGYt26dfGOd7wjxsbGYmxsLFatWuWcEWAWDo4L8M9//rPz0ksvxT/+8Y84depUnDx58sKv586di9OnT8fZs2cjIuLFF1+MmZmZxBsDAFU2MDAQrdblp23XXnttLFmy5KLfL1u2LPr6+uLtb3979PT0xIoVK6Ldbsfg4GAsX778QkAPDQ3FypUrnQsCLML/AXV9aBbl0aFYAAAAAElFTkSuQmCC",
    closeBtnIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB8klEQVRYhc3YPVKDQBQH8D+BAFEmRYqkcCYnkM4bODbGxvEUlnoQLT2FYyNpHDtvQE7gjA2FhZMIrjBYOEE+dtm3EBJfldmwvF+y2ce+aODEzdlFOvj64L3VOkJriOvHe608Xhi4OzlJO8kuiMunpyx/9mLbiDJG2yUijzHKgyPbhtPvw9T1TpKyJMHy+xvvUVQY125n56nNltnAgeNgYFR8G40wjvG2/MsZmQ56eQSAzhG8HDZbQpp17/gY+niMJAjw+fyslFBlbi3EdF1YR0e/F06n0CwLq/mchNifzWAeHmZz4yAA833h9b26m1muW4Htn54qIUT3UoJ8cT6BDMNDiO5FhjDfB1ssyBgRgi0WtcsihQDAyvNImDrEyvNkaeS7Zo0BUElkrtdd01ohyBASpgUCICxNGcNbprYIZQgF0wTRCCKNtNmDXBki2h3roBa9VhAZog2GDKktVgpFTxSk7UstVqKtTXlQSr8RKoJagRtBTNdVqph1GFHhI0F4j25ZnRBhNnoMoBYrHkZ2DKj9sTLfhzEeQ59MEL++Inx5kSLymDSKsrmyY4B016ieU5vO7YXWsDDAkqRxYmqUc4TWsNrpjWwbA8PorK0I4xhhHBcaLG6nV+7AthX/qwnfFYb7t0Q+yv3wJiMyHVx5D5W8P6TqD53h3lcAAAAAAElFTkSuQmCC"
}


let cursorHtml = `
<div class="modal">
  <div class="header">
    <div class="title">Choose a build from the list</div>
    <div class="close-btn">
      <img src="${icons.closeBtnIcon}">
    </div>
  </div>
  <div class="contents">
    <div class="build-list">

    </div>
    <div class="pasteImageContainer">
      <img class="pasteImage" src="${icons.pasteImageIcon}" />
    </div>
  </div>
  <div class="footer">
    <button class="add-btn m28likeButton">Add +</button>
    <button class="cancel-btn m28likeButton">Cancel</button>
    <button class="save-btn m28likeButton" disabled>Save</button>
  </div>
</div>
`;

let cursorStyles = `
<style>
.modal {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 27%;
  height: 80%;
  background-color: #DB9D5A;
  padding: 20px 0 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 6px solid #B17F49;
  border-radius: 6px;
}

.modal * {
  box-sizing: border-box;
  font-family: 'Ubuntu';
  color: white;
  -webkit-text-stroke: 1.3px black;
}

.modal .header {
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
}

.modal .build-list > img {
  width: 100%;
  cursor: pointer;
}

.modal .close-btn, .modal .close-btn > button {
    cursor: pointer;
    height: 34px;
}

.modal .title {
  font-size: 1.9em;
  height: fit-content;
}

.modal .footer {
  display: flex;
  justify-content: space-evenly;
  margin-right: 20px;
}

.modal .add-btn {
  border-color: green;
  background: mediumseagreen;
}
.modal .cancel-btn {
  border-color: blue;
  background: cornflowerblue;
}
.modal .save-btn {
  border-color: red;
  background: lightcoral;
}
.modal .save-btn[disabled] {
  border-color: grey;
  background: lightgrey;
}

.modal button.m28likeButton {
  width: 100px;
  padding-block: 2px;
  border-style: solid;
  border-width: 6px;
  border-radius: 6px;
  font-size: 16px;
}

.modal button.m28likeButton:hover:not([disabled]) {
  filter: brightness(115%);
  cursor: pointer;
}

.modal .cancel-btn, .modal .save-btn {
  display: none;
}

.modal .contents {
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  // align-items: center;
  justify-content: center;
  padding-right: 19px;
  margin-right: 13px;
}

.modal .contents::-webkit-scrollbar {
  width: 24px;               /* width of the entire scrollbar */
}

.modal .contents::-webkit-scrollbar-track {
  background: transparent;        /* color of the tracking area */
}

.modal .contents::-webkit-scrollbar-thumb {
  background-color: #AF7E48;    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
  border: 8px solid #DB9D5A;  /* creates padding around scroll thumb */
}

.modal .pasteImage {
  display: none;
  width: 40px;
  height: fit-content;
}

.modal .pasteImage.imagePasted {
  width: 100%;
}

</style>
`;

(function() {
    'use strict';

    function removeChilds (parent) {
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
        }
    };

    async function main() {
        $("body").append(cursorHtml);
        $("head").append(cursorStyles);

        const modal = document.querySelector('.modal');
        const closeBtn = document.querySelector('.close-btn > img');
        const addBtn = document.querySelector('.add-btn');
        const buildList = document.querySelector('.build-list');
        const header = document.querySelector('.header');
        const cancelBtn = document.querySelector('.cancel-btn');
        const saveBtn = document.querySelector('.save-btn');
        const pasteImage = document.querySelector('.pasteImage');

        function loadList() {
            fetch(`${firebaseEndpoint}/builds.json`, {
                method: "GET",
            }).then((resp) => resp.json()).then((data) => {
                removeChilds(buildList);
                let element;
                for (const key in data) {
                    element = document.createElement("img");
                    element.src = data[key].image;
                    element.title = data[key].build;
                    element.onclick = () => {
                        //console.log("image clicked");
                        if (deletePressed) {
                            //console.log("Deleting this:", data[key].build);
                            fetch(`${firebaseEndpoint}/builds/${key}.json`, {
                                method: "DELETE",
                            }).then((resp) => resp.json()).then((data) => {
                                loadList();
                            });
                        } else {
                            localStorage.setItem("cached_equipped", data[key].build);
                            location.reload();
                        }
                    }
                    buildList.appendChild(element);
                }
            });
        }

        function goBackToList() {
            $(buildList).show();
            $(header).show();
            $(addBtn).show();
            $(cancelBtn).hide();
            $(saveBtn).hide();
            $(pasteImage).hide();

            pasteImage.src = icons.pasteImageIcon;
            $(pasteImage).removeClass("imagePasted");
            $(saveBtn).attr("disabled", "true");
        }

        loadList();


        let deletePressed = false;
        document.addEventListener("keydown", ev => {
            // open builds menu
            if (ev.key === "Escape") {
                $(modal).toggle();
            } else if (ev.key === "Delete") {
                deletePressed = true;
            }
        });

        document.addEventListener("keyup", ev => {
            if (ev.key === "Delete") {
                deletePressed = false;
            }
        });

        document.addEventListener("paste", event => {
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            // console.log(JSON.stringify(items)); // will give you the mime types
            for (let index in items) {
                var item = items[index];
                if (item.kind === 'file') {
                    var blob = item.getAsFile();
                    var reader = new FileReader();
                    reader.onload = function(event){
                        pasteImage.src = event.target.result;
                        $(pasteImage).addClass("imagePasted");
                        $(saveBtn).removeAttr("disabled");
                    };
                    reader.readAsDataURL(blob);
                }
            }
        });

        closeBtn.onclick = () => {
            $(modal).hide();
        }

        addBtn.onclick = () => {
            $(buildList).hide();
            $(header).hide();
            $(addBtn).hide();
            $(cancelBtn).show();
            $(saveBtn).show();
            $(pasteImage).show();
        }

        cancelBtn.onclick = () => {
            goBackToList();
        }

        saveBtn.onclick = () => {
            if (pasteImage.src.length > 0) {
                //console.log("Saving build");
                fetch(`${firebaseEndpoint}/builds.json`, {
                    method: "POST",
                    body: JSON.stringify({
                        build: localStorage.getItem("cached_equipped"),
                        image: pasteImage.src,
                    })
                }).then((resp) => {
                    if (resp.status === 200) {
                        goBackToList();

                        loadList();
                    }
                });
            }
        }


    }

    try {
        main();
    } catch (e) {
        //console.log(`Florr.io build selector error: ${e}`);
    }

})();