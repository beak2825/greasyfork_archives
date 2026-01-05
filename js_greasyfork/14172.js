// ==UserScript==
// @name         T411 Shoutbox - Ignore
// @namespace    https://www.t411.io
// @version      1.2.1
// @description  ajoute une fonction d'ignore sur la shout de t411
// @author       RavenRoth
// @include      http://www.t411.al/chati/*
// @include      https://www.t411.al/chati/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14172/T411%20Shoutbox%20-%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/14172/T411%20Shoutbox%20-%20Ignore.meta.js
// ==/UserScript==
var body = 'PGRpdiBpZD0iZGl2bGlzdCI+DQo8c2VsZWN0IHN0eWxlPSJoZWlnaHQ6IGNhbGMoMTAwJSAtIDI1cHgpOyB3aWR0aDogMTAwJTsiIG11bHRpcGxlIGlkPSJsaXN0Ij4NCjwvc2VsZWN0Pg0KPGJ1dHRvbiB0eXBlPSJidXR0b24iIGlkPSJhZGQiPis8L2J1dHRvbj4gPGJ1dHRvbiB0eXBlPSJidXR0b24iIGlkPSJyZW0iPi08L2J1dHRvbj4gfCA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgaWQ9ImNsZWFyIj5FZmZhY2VyIHRvdXQ8L2J1dHRvbj4gfCBOaXZlYXUgOiA8c2VsZWN0IGlkPSJsZXZlbCI+DQogIDxvcHRpb24gdmFsdWU9IjAiPkQmZWFjdXRlO3NhY3RpdiZlYWN1dGU7PC9vcHRpb24+DQogIDxvcHRpb24gdmFsdWU9IjEiPkNlbnN1cmVyPC9vcHRpb24+DQogIDxvcHRpb24gdmFsdWU9IjIiPk1hc3F1ZXI8L29wdGlvbj4NCjwvc2VsZWN0PiB8IDxidXR0b24gdHlwZT0iYnV0dG9uIiBpZD0ibGlzdGltcCI+SW1wb3J0PC9idXR0b24+IDxidXR0b24gdHlwZT0iYnV0dG9uIiBpZD0ibGlzdGV4cCI+RXhwb3J0PC9idXR0b24+DQo8L2Rpdj4NCjxkaXYgaWQ9ImRpdmltcCIgc3R5bGU9ImRpc3BsYXk6IG5vbmU7Ij4NCjx0ZXh0YXJlYSBpZD0idHh0aW1wIiBzdHlsZT0iaGVpZ2h0OiBjYWxjKDEwMCUgLSAyNXB4KTsgd2lkdGg6IDEwMCU7ICIgd3JhcD0iaGFyZCI+PC90ZXh0YXJlYT4NCjxidXR0b24gdHlwZT0iYnV0dG9uIiBpZD0iaW1wIj5JbXBvcnRlcjwvYnV0dG9uPiA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgaWQ9ImNhbmNlbCI+QW5udWxlcjwvYnV0dG9uPg0KPC9kaXY+DQo8ZGl2IGlkPSJkaXZleHAiIHN0eWxlPSJkaXNwbGF5OiBub25lOyI+DQo8dGV4dGFyZWEgaWQ9InR4dGV4cCIgc3R5bGU9ImhlaWdodDogY2FsYygxMDAlIC0gMjVweCk7IHdpZHRoOiAxMDAlOyAiIHdyYXA9ImhhcmQiIHJlYWRvbmx5PjwvdGV4dGFyZWE+DQo8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgaWQ9ImNsb3NlIj5SZXRvdXI8L2J1dHRvbj4NCjwvZGl2Pg=='
var head = 'PHRpdGxlPklnbm9yZSBMaXN0PC90aXRsZT4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICogeyBtYXJnaW46MDsgcGFkZGluZzowO30NCjwvc3R5bGU+'
var pseudos
var count = 0
var button
var level
function store(list)
{
  var i;
  pseudos.length = 0
  for (i = 0; i < list.length; i++) {
    pseudos.push(list.options[i].text);
  }
  localStorage.setItem('pseudos', JSON.stringify(pseudos))
}
function add() {
  //Create an input type dynamically.   
  button = document.createElement('input');
  //Assign different attributes to the element. 
  button.type = 'button';
  button.value = 'Ignore (' + count + ')'; // Really? You want the default value to be the type string?
  button.name = 'Ignore'; // And the name too?
  button.className = 'button';
  button.onclick = function () { // Note this is a function
    var win = window.open('', 'Config', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=400, height=200');
    win.document.head.innerHTML = atob(head)
    win.document.body.innerHTML = atob(body)
    var liste = win.document.getElementById('list');
    for (i = 0; i < pseudos.length; i++) {
      var option = win.document.createElement('option');
      option.text = pseudos[i];
      liste.add(option);
    }
    win.document.getElementById('add').onclick = function () {
      var pseudo = win.prompt('Pseudo');
      if (pseudo != null) {
        var option = win.document.createElement('option');
        option.text = pseudo;
        liste.add(option);
        store(liste);
      }
    }
    win.document.getElementById('rem').onclick = function () {
      var i;
      for (i = liste.options.length - 1; i >= 0; i--)
      {
        if (liste.options[i].selected)
        liste.remove(i);
      }
      store(liste);
    }
    win.document.getElementById('clear').onclick = function () {
      liste.length = 0;
      store(liste);
    }
    win.document.getElementById('listimp').onclick = function () {
      win.document.getElementById('divlist').style.display = 'none';
      win.document.getElementById('divimp').style.display = 'block';
      win.document.getElementById('divexp').style.display = 'none';
    }
    win.document.getElementById('listexp').onclick = function () {
      win.document.getElementById('divlist').style.display = 'none';
      win.document.getElementById('divimp').style.display = 'none';
      win.document.getElementById('divexp').style.display = 'block';
      var tmpexp = {
      };
      tmpexp.level = level;
      tmpexp.pseudos = pseudos;
      win.document.getElementById('txtexp').value = btoa(JSON.stringify(tmpexp));
    }
    win.document.getElementById('imp').onclick = function () {
      var tmpimp
      try {
        tmpimp = JSON.parse(atob(win.document.getElementById('txtimp').value))
      } 
      catch (e)
      {
        win.alert('Config importée non reconue')
        win.document.getElementById('txtimp').value = '';
        return 1;
      }
      if (tmpimp.pseudos && tmpimp.level)
      {
        pseudos = tmpimp.pseudos
        liste.length = 0;
        for (i = 0; i < pseudos.length; i++) {
          var option = win.document.createElement('option');
          option.text = pseudos[i];
          liste.add(option);
        }
        level = tmpimp.level
        win.document.getElementById('level').options[level].selected = true;
        store(liste);
        localStorage.setItem('level', level);
        win.document.getElementById('divlist').style.display = 'block';
        win.document.getElementById('divimp').style.display = 'none';
        win.document.getElementById('divexp').style.display = 'none';
        win.document.getElementById('txtimp').value = '';
      } 
      else
      {
        win.alert('Config importée non reconue')
        win.document.getElementById('txtimp').value = '';
      }
    }
    win.document.getElementById('cancel').onclick = function () {
      win.document.getElementById('divlist').style.display = 'block';
      win.document.getElementById('divimp').style.display = 'none';
      win.document.getElementById('divexp').style.display = 'none';
      win.document.getElementById('txtimp').value = '';
    }
    win.document.getElementById('close').onclick = function () {
      win.document.getElementById('divlist').style.display = 'block';
      win.document.getElementById('divimp').style.display = 'none';
      win.document.getElementById('divexp').style.display = 'none';
      win.document.getElementById('txtexp').value = '';
    }
    levelselect = win.document.getElementById('level')
    levelselect.options[level].selected = true;
    levelselect.onchange = function () {
      level = levelselect.options[levelselect.selectedIndex].value
      localStorage.setItem('level', level)
    }
  };
  var foo = document.getElementById('chat');
  //Append the element in page (in span).  
  foo.insertBefore(button, document.getElementById('online'));
}
function anchor()
{
  document.getElementById('messages').addEventListener('DOMNodeInserted', function (event)
  {
    if (event.target.parentNode.id == 'messages')
    {
      var element = document.getElementsByClassName(event.target.className) [0];
      var _first = element.getElementsByTagName('div') [0];
      var _second = _first.getElementsByTagName('div') [0];
      var _third = _second.getElementsByTagName('strong') [0];
      var _message = _first.getElementsByTagName('p') [0];
      var pseudo = _third.getElementsByTagName('a') [0].text;
      var lowpseudos = pseudos.map(function (value) {
        return value.toLowerCase();
      })
      if (lowpseudos.indexOf(pseudo.toLowerCase()) > - 1)
      {
        if (level == 2)
        {
          event.target.parentElement.removeChild(event.target);
        } 
        else if (level == 1)
        {
          _message.innerHTML = '[ignor&eacute;]';
        }
        button.value = 'Ignore (' + ++count + ')';
      }
    }
  }, false);
}
pseudos = JSON.parse(window.localStorage.getItem('pseudos'))
if (!pseudos)
{
  pseudos = [
  ]
}
level = window.localStorage.getItem('level')
if (!level)
{
  level = 2
}
add();
anchor();
