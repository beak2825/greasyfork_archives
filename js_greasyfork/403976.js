// Vars
let darkmodeEnabled;

let coronaBuddyPopup = /*html*/`
  <span style="color: lime !important; top: 0; right: 0; padding: 1em 1em 1em 1em; display: block; position: absolute; font-weight: 800;">
    <span style="cursor: pointer" onclick="document.querySelector('#coronaBuddyPopupInstance').remove()">X</span>
  </span>
    <div class="popup__banner">
        <p class="popup__banner--text">Coronabuddy</p>
    </div>
    <div class="popup">
        <textarea id="popup__textarea" class="popup__textarea class"></textarea>
    </div>
    <div class="popup__button--center">
    <button id="popup__save" class="popup__button popup__button--save"><p id="popup__save--text" class="popup__button--text">SAVE LIST</p></button>
    <button id="popup__clear" class="popup__button popup__button--clear"><p class="popup__button--text">CLEAR LIST</p></button>
    </div>
    <div class="popup__darkmode">
        <div class="popup__darkmode--text">Dark Mode?</div>
        <div id="popup__check" class="popup__darkmode--checkbox"></div>
    </div>
`;

function saveNiggerList() {
  if (document.querySelector("#popup__textarea")) {
    GM.setValue(
      "gayNiggerList",
      document.querySelector("#popup__textarea").value
    ).then(() => {
      location.reload();
    });
  }
}

function clearNiggerList() {
  if (document.querySelector("#popup__textarea")) {
    GM.setValue("gayNiggerList", "Gay Nigger 1, Gay Nigger 2").then(() => {
      location.reload();
    });
  }
}

function coronaBuddyDarkmodeToggle() {
  if (darkModeEnabled === true) {
    darkModeEnabled = false;
    document
      .querySelector("#popup__check")
      .classList.remove("popup__darkmode--checkbox--check");
    GM.setValue("darkmodeEnabled", false).then(() => {
      location.reload();
    });
  } else {
    darkModeEnabled = true;
    document
      .querySelector("#popup__check")
      .classList.add("popup__darkmode--checkbox--check");
    GM.setValue("darkmodeEnabled", true).then(() => {
      location.reload();
    });
  }
}

GM.registerMenuCommand(
  "Coronabuddy Options",
  function () {
    let coronaBuddyPopupInstance = document.createElement("div");
    coronaBuddyPopupInstance.id = "coronaBuddyPopupInstance"
    coronaBuddyPopupInstance.innerHTML = coronaBuddyPopup;
    coronaBuddyPopupInstance.style.cssText +=
      "position: fixed; top: 10em; text-align: center; max-width: 20em; height: 60vh; margin: 0 auto; background-color: black; left: 0; right: 0;";

    document.body.appendChild(coronaBuddyPopupInstance);
    document.querySelector(".popup__button--save").onclick = saveNiggerList;
    document.querySelector(".popup__button--clear").onclick = clearNiggerList;
    document.querySelector("#popup__check").onclick = coronaBuddyDarkmodeToggle;
    GM.getValue("darkmodeEnabled", false).then((value) => {
      darkModeEnabled = value;
      if (value === false) {
      } else {
        document
          .querySelector("#popup__check")
          .classList.add("popup__darkmode--checkbox--check");
      }
    });
    document.querySelector("#popup__textarea").value = gayNiggerList;
    document
      .getElementById("popup__textarea")
      .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          saveNiggerList();
          document
            .getElementById("popup__save")
            .classList.add("popup__button--invert");
          document
            .getElementById("popup__save--text")
            .classList.add("popup__button--invert");
          setTimeout(() => {
            document
              .getElementById("popup__save")
              .classList.remove("popup__button--invert");
            document
              .getElementById("popup__save--text")
              .classList.remove("popup__button--invert");
          }, 1000);
        }
      });
  },
  "r"
);
