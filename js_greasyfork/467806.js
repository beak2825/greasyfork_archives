// ==UserScript==
// @license MIT
// @name         Obtener Trending Posts de Reddit
// @namespace    https://www.example.com
// @version      1.0.3
// @description  Obtiene los trending posts de Reddit y los muestra en una página
// @author       Tu Nombre
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467806/Obtener%20Trending%20Posts%20de%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/467806/Obtener%20Trending%20Posts%20de%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isFetchingPosts = false; // Variable para controlar si se están obteniendo más publicaciones
    let after = ''; // ID de la última publicación obtenida

    // Función para obtener los trending posts de Reddit
    function getTrendingPosts() {
        if (isFetchingPosts) {
            return; // Evitar múltiples llamadas mientras se están obteniendo publicaciones
        }

        isFetchingPosts = true;

        fetch(`https://www.reddit.com/r/all.json?after=${after}`)
            .then(response => response.json())
            .then(data => {
                isFetchingPosts = false;

                // Recorremos los trending posts y los mostramos en la página
                data.data.children.forEach(post => {
                    const postTitle = post.data.title;
                    const postAuthor = post.data.author;
                    const postScore = post.data.score;

                    const postElement = document.createElement('p');
                    postElement.innerHTML = `<strong>${postTitle}</strong> - Autor: ${postAuthor} - Puntuación: ${postScore}`;
                    const trendingPostsElement = document.getElementById('trendingPosts');
                    if (trendingPostsElement) {
                        trendingPostsElement.appendChild(postElement);
                    }
                });

                after = data.data.after; // Actualizamos el ID de la última publicación obtenida
            })
            .catch(error => {
                console.log('Ha ocurrido un error:', error);
                isFetchingPosts = false; // Reiniciamos la variable en caso de error
            });
    }

    // Verificar si estamos en una página de Reddit
    const isRedditPage = window.location.hostname === 'www.reddit.com';
    if (isRedditPage) {
        // Crear la estructura de la página
        const containerElement = document.createElement('div');
        containerElement.className = 'container';
        containerElement.innerHTML = `
            <h1>Trending Posts de Reddit</h1>
            <div id="trendingPosts"></div>
        `;
        document.body.appendChild(containerElement);

        // Registrar el evento de scroll para cargar más publicaciones cuando sea necesario
        window.addEventListener('scroll', function() {
            const scrollPosition = window.innerHeight + window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight;
            const buffer = 200; // Espacio adicional antes de llegar al final de la página

            if (scrollPosition >= documentHeight - buffer) {
                getTrendingPosts();
            }
        });

        // Obtener los primeros trending posts al cargar la página
        getTrendingPosts();
    }
})();
