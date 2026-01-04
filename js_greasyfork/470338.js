// ==UserScript==
// @name         RealmEye-AddCheckboxes
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  This script enhances your fame farming experience in the game RotMG by adding convenient checkboxes to fame bonuses on the Realmeye website.
// @author       Dominik Mráz
// @match        https://www.realmeye.com/wiki/fame-bonuses
// @icon         https://www.google.com/s2/favicons?sz=64&domain=realmeye.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470338/RealmEye-AddCheckboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/470338/RealmEye-AddCheckboxes.meta.js
// ==/UserScript==


//loading and saving characters work now, todo:maybe add icons for different characters
(function() {
    'use strict';

    //lets create floating buttons for saving/loading characters!!
    function addFloatingBox(){
    const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "floating-buttons";

  const style = document.createElement("style");
  style.textContent = `
    .floating-buttons {
      position: fixed;
      bottom: 20px;
      right: 20px;
    }

    .floating-button {
      display: block;
      margin-bottom: 10px;
      padding: 10px 15px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }

    .floating-button:hover {
      background-color: #0056b3;
    }

    .character-buttons {
      display: block;
      margin-bottom: 10px;
      padding: 10px 15px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }

  `;

  document.head.appendChild(style);

        //savebutton
    const buttonSave = document.createElement("button");
    buttonSave.className = "floating-button";
    buttonSave.textContent = `Save`;

    buttonSave.addEventListener("click", function() {
        document.getElementsByClassName("character-buttons")[0].style.display='none';
                document.getElementsByClassName("load")[0].style.display='block';
      // Zde můžete přidat kód pro otevření chatovacího okna nebo provést jinou akci
      console.log(`Tlačítko ${buttonSave.textContent} bylo stisknuto!`);
        var saveName=document.getElementsByClassName('floating-input')[0].value;
        if (saveName){

        var checkboxes=document.querySelectorAll('input[type="checkbox"]')
        const checkboxStates = Array.from(checkboxes).map(checkbox => checkbox.checked);

        localStorage.removeItem(saveName);
        localStorage.setItem(saveName, JSON.stringify(checkboxStates));
        var characters=localStorage.getItem("Characters");
        //console.log(characters[0]);
        
        if (characters)
        {

         const parsedCharacters = JSON.parse(characters);
         var usedname=false;
         parsedCharacters.forEach((name, index) => {
                    if (name==saveName){
                    usedname=true;
                    }
                });
         if (usedname){
             console.log('Name used')




         }
         else{
         var insert=parsedCharacters;
             insert.push(saveName);
         localStorage.setItem("Characters",JSON.stringify(insert));
         }


        
        }
        else{

        var insert2=Array.from(new Set([saveName]));
        console.log(JSON.stringify(insert2));
        localStorage.setItem("Characters",JSON.stringify(insert2))
        }
        

       

        }
        else{alert('Please enter character name into the text box;');}

    });

        //loadButton
        const buttonLoad = document.createElement("button");
    buttonLoad.className = "floating-button load";
    buttonLoad.textContent = `Characters`;

    const characterButtons = document.createElement("div");
        characterButtons.className = "character-buttons";
        characterButtons.style.display = 'none';
    buttonLoad.addEventListener("click", function() {
        buttonLoad.style.display = 'none';
        addCharacters(characterButtons);});

     //deleteButton deltes character(dying :( F)
        const buttonDelete = document.createElement("button");
    buttonDelete.className = "floating-button";
    buttonDelete.textContent = `Delete character`;

    buttonDelete.addEventListener("click", function() {
      // Zde můžete přidat kód pro otevření chatovacího okna nebo provést jinou akci
      console.log(`Tlačítko ${buttonDelete.textContent} bylo stisknuto!`);
      var name=document.getElementsByClassName("floating-input")[0].value;
      const response = confirm(`Are you sure you want to delete ${name} ?`);
      if(response){
          deleteCharacter(name);
      console.log(response);}
    });
        //inputButton
    const buttonInput = document.createElement("input");
    buttonInput.className = "floating-button floating-input";
    
    buttonInput.addEventListener("click", function() {
      // Zde můžete přidat kód pro otevření chatovacího okna nebo provést jinou akci
      console.log(`Tlačítko ${buttonInput.textContent} bylo stisknuto!`);
    });




    buttonsContainer.appendChild(buttonLoad);
    buttonsContainer.appendChild(characterButtons);
    buttonsContainer.appendChild(buttonDelete);
    buttonsContainer.appendChild(buttonSave);
    buttonsContainer.appendChild(buttonInput);




  document.body.appendChild(buttonsContainer);
        if(localStorage.getItem("Characters")!=null)
       {
       var charname=JSON.parse(localStorage.getItem("Characters"))[0];
       buttonInput.value = charname;
       loadCharacterCheckboxes(charname);
       }
    else{
        buttonInput.value = `Character name`;
    }

    }

    function deleteCharacter(name) {
        var saveNames=localStorage.getItem('Characters');
        var usedname=false;
        if (saveNames) {
          var characterNames = JSON.parse(saveNames);
          characterNames.forEach((saveName, index) => {
                    if (name==saveName){
                    usedname=true;
                    }
                });
            if(usedname)
            {
            localStorage.removeItem(name);

            var characters=JSON.parse(localStorage.getItem("Characters"));

            var index=characters.indexOf(name); // Najdeme index prvku s názvem "Ninja"
                if (index !== -1) {
                    characters.splice(index, 1); // Odstraníme prvek z pole pomocí metody splice

                localStorage.removeItem("Characters");
                localStorage.setItem("Characters",JSON.stringify(characters));
                console.log(characters[0]);
                document.getElementsByClassName("floating-input")[0].value=characters[0];
                document.getElementsByClassName("character-buttons")[0].style.display='none';
                document.getElementsByClassName("load")[0].style.display='block';
                loadCharacterCheckboxes(characters[0]);
                }
            }





        }
        //není save name v seznamu charakteru, nemuzeme smazat
        else {
            alert(`Character ${name} not found!`)
        }


    }
    function addCharacters(characterButtons) {
        while (characterButtons.firstChild) {
               characterButtons.removeChild(characterButtons.firstChild);
               }

        characterButtons.style.display = 'block';
        var saveNames=localStorage.getItem('Characters');
        if (saveNames) {
    var characterNames = JSON.parse(saveNames);

    characterNames.forEach(function(name) {
        console.log(`Tlačítko charakteru by mělo být vytvořenu !`);
        var characterButton = document.createElement('button');
        characterButton.textContent = name;
        characterButton.className= "floating-button Characters";
        characterButton.addEventListener('click', function() {
            console.log(`Tlačítko ${characterButton.textContent} bylo stisknuto!`);
            loadCharacterCheckboxes(name);

            characterButtons.style.display = 'none';
            // Zde můžete provést akce pro zobrazení konkrétní postavy podle jména
        });
        // Přidání tlačítka postavy do DOM
        // ...

    var archiv = characterButtons;
    characterButtons.appendChild(characterButton);
    });
                                                  }}

    function loadCharacterCheckboxes(name){

            document.getElementsByClassName("load")[0].style.display = 'block';
            document.getElementsByClassName("floating-input")[0].value=name;
            const storedCheckboxStates = localStorage.getItem(name);
            if (storedCheckboxStates) {
                const parsedCheckboxStates = JSON.parse(storedCheckboxStates);
                const checkboxes = document.querySelectorAll("input[type='checkbox']");
                console.log(`Načítání checkboxu postavy:${name}`);
                checkboxes.forEach((checkbox, index) => {
                    checkbox.checked = parsedCheckboxStates[index];
                });
            }
    }


    function addCheckboxesToTables() {
  // Vyberte všechny tabulky na stránce
  var tables = document.querySelectorAll('table');

  
    // Vyberte všechny řádky v tabulce only for dungeon collection fame bonuses
    var rows = tables[2].getElementsByTagName('tr');

    // Projděte každý řádek a přidejte checkbox nebo název sloupce
    for (var i = 0; i < rows.length; i++) {
      var cells = rows[i].querySelectorAll('td, th');

      // Pokud je první buňka th, přidejte název sloupce
      if (cells[0].tagName === 'TH') {
        var columnName = document.createElement('th');
        columnName.textContent = 'Check';
        rows[i].insertBefore(columnName, cells[0]);
      } else {
        var checkboxContainer = document.createElement('td');
        checkboxContainer.style.textAlign = 'center';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkboxContainer.appendChild(checkbox);
        checkbox.setAttribute('id', 'main-checkbox');

        rows[i].insertBefore(checkboxContainer, cells[0]);
      }
    }
 
}
function addCheckboxesToDungeons() {
    var table = document.querySelector('table td:has(a[name="Tunnel Rat"])').closest('table');


    if (table) {
        var rows = table.getElementsByTagName('tr');

        for (var i = 1; i < rows.length; i++) {
            var dungeonNameCell = rows[i].querySelector('td:nth-child(3)');
            if (dungeonNameCell) {
                console.log(dungeonNameCell);
                var checkboxContainer = document.createElement('td');

                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.setAttribute('id', 'main-checkbox');

                var textElement = dungeonNameCell.innerHTML;
                if (textElement) {

                    var lines=''
                    lines = textElement.split('\n'); // Rozdělí vstupní text na pole řádků
                    console.log(textElement);

                    console.log('lines:'+lines);
                    //console.log('id?'+lines[2]);
                    for (var a = 2; a < lines.length; a++) { // Začínáme na indexu 2 (třetí řádek)
                       // handleCheckboxGroup(lines[a]);
                        //console.log('id:'+lines[a]);
                        lines[a] = lines[a].replace(/(.+)/, '$1 <input type="checkbox"+ id="$1" class="'+lines[1]+'"></input>'); // Nahradíme řádek zaškrtávacím políčkem

                        //console.log(lines[1]);


                    }

                    var output = lines.join('\n'); // Sestavíme pole zpět do textu s oddělovačem '\n'

                    dungeonNameCell.innerHTML = output;
                            //dungeonNameCell.innerHTML = textElement.replace(/\n/g, ' <input type=checkbox></input>\n');
                            checkboxContainer.appendChild(checkbox);
                    //console.log(lines);

                    //dungeonNameCell.parentNode.insertBefore(checkboxContainer, dungeonNameCell);

                }
            }
        }
    }
}



    function handleCheckboxGroup(id) {
        console.log('Starting handleCheckboxGroup function with id:'+id);
  var checkboxes = document.querySelectorAll('input[type="checkbox"][id="' + id + '"]');

        console.log('I have found these checkboxes:'+checkboxes);


  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      // Zaškrtnutí / Odškrtnutí všech políček s tímto ID
      checkboxes.forEach(function (chk) {
        chk.checked = checkbox.checked;
      });
    });
  });
}

     function handleCollectionCheckboxGroup(id,button) {




  var checkboxes = document.querySelectorAll('input[type="checkbox"][class="' + id + '"]');
//console.log('I have found these checkboxes:');
checkboxes.forEach((checkbox) => {
    console.log('checkbox:'+checkbox);
    console.log('checkbox:'+checkbox.checked);
        console.log('maincheckbox:'+button);
    console.log('maincheckbox:'+button.checked);

    checkbox.checked=!button.checked;
    console.log('ID checkboxu ve funkci:'+checkbox.id);
    //handleCheckboxGroup(checkbox.id);
    //dispatchEvent(new Event('change'));
    checkbox.click();





});




}




    // Volání funkcí po načtení stránky
    window.addEventListener('load', function() {
        addCheckboxesToTables();
        addCheckboxesToDungeons();
        handleCheckboxGroup();
        handleCollectionCheckboxGroup();
        addFloatingBox();


    });

    document.addEventListener('click', event => {
            const button = event.target.closest('input[type="checkbox"]');
            if (button.id!="main-checkbox") {
                console.log('Objekt, na který jste kliknul:'+button);
                console.log('ID tlačítka:'+button.id);
                handleCheckboxGroup(button.id);
            }
            else {


                console.log('Starting handleCollectionCheckboxGroup function');
                var id=event.target.closest('tr').innerHTML;
                var lines_collection=id.split('/td>');
                var lines2=lines_collection[2].split('\n');
                var class_button=lines2[2];
                
                console.log('U just pressed main-button, im sending info to start function');
                handleCollectionCheckboxGroup(class_button,button);




            }


        }, true);


})();