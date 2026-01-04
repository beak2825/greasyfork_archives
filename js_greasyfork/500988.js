// ==UserScript==
// @name         Marcadores Flotantes
// @namespace    https://www.facebook.com/desgarenecillos
// @version      2.00
// @description  Gestiona tus marcadores con facilidad y de manera segura ya que agrega contraseña para ver los marcadores guardados.
// @author       DESGARENECILLOS
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/500988/Marcadores%20Flotantes.user.js
// @updateURL https://update.greasyfork.org/scripts/500988/Marcadores%20Flotantes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentPassword = GM_getValue('password', '0000');
    const bookmarks = GM_getValue('bookmarks', {});

    function createButton(text, onClick, color) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.backgroundColor = color;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.margin = '5px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = onClick;
        return button;
    }

    function createDiv(id) {
        const div = document.createElement('div');
        div.id = id;
        div.style.position = 'fixed';
        div.style.backgroundColor = 'white';
        div.style.border = '1px solid black';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        div.style.padding = '10px';
        div.style.zIndex = '1000';
        div.style.minWidth = '300px';
        div.style.top = '50%';
        div.style.left = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.display = 'none';
        return div;
    }

    function showNotification(message, color) {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = color;
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.transition = 'opacity 2s';
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 2000);
        }, 3000);
    }

    function saveBookmark() {
        const url = window.location.href;
        let title = document.title.trim();
        if (!title) {
            title = url;
        }
        const updatedBookmarks = GM_getValue('bookmarks', {});
        if (updatedBookmarks[url]) {
            showNotification('Este enlace ya está guardado.', 'red');
        } else {
            updatedBookmarks[url] = title;
            GM_setValue('bookmarks', updatedBookmarks);
            showNotification('Página agregada con éxito.', 'green');
        }
    }

    function viewBookmarks() {
        const passwordDiv = createDiv('passwordDiv');
        const input = document.createElement('input');
        input.type = 'password';
        input.placeholder = 'Contraseña';
        passwordDiv.appendChild(input);
        passwordDiv.appendChild(createButton('Entrar', () => {
            if (input.value === currentPassword) {
                document.body.removeChild(passwordDiv);
                showBookmarks();
            } else {
                showNotification('Contraseña incorrecta.', 'red');
            }
        }, '#0866FF'));
        passwordDiv.appendChild(createButton('Cancelar', () => document.body.removeChild(passwordDiv), '#3a3b3c'));
        passwordDiv.appendChild(createButton('Cambiar Contraseña', changePassword, '#0866FF'));
        document.body.appendChild(passwordDiv);
        passwordDiv.style.display = 'block';
    }

    function changePassword() {
        removeDivs();
        const changeDiv = createDiv('changeDiv');
        const currentInput = document.createElement('input');
        currentInput.type = 'password';
        currentInput.placeholder = 'Contraseña Actual';
        changeDiv.appendChild(currentInput);
        const newInput = document.createElement('input');
        newInput.type = 'password';
        newInput.placeholder = 'Nueva Contraseña';
        changeDiv.appendChild(newInput);
        changeDiv.appendChild(createButton('Cambiar', () => {
            if (currentInput.value === currentPassword) {
                currentPassword = newInput.value;
                GM_setValue('password', currentPassword);
                showNotification('Contraseña cambiada.', 'green');
                document.body.removeChild(changeDiv);
            } else {
                showNotification('Contraseña actual incorrecta.', 'red');
            }
        }, '#0866FF'));
        changeDiv.appendChild(createButton('Cancelar', () => document.body.removeChild(changeDiv), '#3a3b3c'));
        document.body.appendChild(changeDiv);
        changeDiv.style.display = 'block';
    }

function showBookmarks() {
    removeDivs();
    const bookmarksDiv = createDiv('bookmarksDiv');
    const updatedBookmarks = GM_getValue('bookmarks', {});

    // Contenedor para los botones de enlaces, con scroll si exceden el espacio
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column'; // Organizar botones en columna
    buttonContainer.style.gap = '10px'; // Espacio entre botones
    buttonContainer.style.maxWidth = '100%';
    buttonContainer.style.maxHeight = '300px'; // Altura máxima para el contenedor
    buttonContainer.style.overflowY = 'auto'; // Barra de desplazamiento vertical si es necesario

    for (const [url, title] of Object.entries(updatedBookmarks)) {
        const linkButton = document.createElement('button');
        linkButton.innerText = title;
        linkButton.style.backgroundColor = '#0866FF';
        linkButton.style.color = 'white';
        linkButton.style.border = 'none';
        linkButton.style.padding = '10px';
        linkButton.style.borderRadius = '5px';
        linkButton.style.cursor = 'pointer';
        linkButton.style.width = '100%'; // Asegura que el botón ocupe todo el ancho del contenedor
        linkButton.onclick = () => window.open(url, '_blank'); // Abre el enlace en una nueva pestaña

        // Botón de eliminar para cada enlace
        const deleteButton = createButton('Eliminar', () => {
            delete updatedBookmarks[url];
            GM_setValue('bookmarks', updatedBookmarks);
            linkButton.remove();
            deleteButton.remove();
            showNotification('Enlace eliminado.', 'green');
        }, '#FF3333');

        // Contenedor de cada enlace con su botón de eliminar
        const linkContainer = document.createElement('div');
        linkContainer.style.display = 'flex';
        linkContainer.style.justifyContent = 'space-between';
        linkContainer.style.alignItems = 'center';

        // Agregar el botón de enlace y el de eliminar al contenedor del enlace
        linkContainer.appendChild(linkButton);
        linkContainer.appendChild(deleteButton);
        buttonContainer.appendChild(linkContainer);
    }

    bookmarksDiv.appendChild(buttonContainer);
    bookmarksDiv.appendChild(createButton('Cerrar', () => document.body.removeChild(bookmarksDiv), '#3a3b3c'));
    document.body.appendChild(bookmarksDiv);
    bookmarksDiv.style.display = 'block';
}

    function removeDivs() {
        const divs = document.querySelectorAll('div[id$="Div"]');
        divs.forEach(div => document.body.removeChild(div));
    }

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'm') {
            removeDivs();
            const mainDiv = createDiv('mainDiv');
            mainDiv.appendChild(createButton('Agregar página', saveBookmark, '#0866FF'));
            mainDiv.appendChild(createButton('Ver páginas guardadas', viewBookmarks, '#0866FF'));
            mainDiv.appendChild(createButton('Cerrar', () => document.body.removeChild(mainDiv), '#3a3b3c'));
            document.body.appendChild(mainDiv);
            mainDiv.style.display = 'block';
        }
    });
})();