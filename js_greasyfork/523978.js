// ==UserScript==
// @name         Pequeño manager para personalizar y hacer mas agradable la lectura de Mangas.
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Se puede cambiar el tamaño de las imagenes del Manga y establecer un tamaño por defecto(desde el codigo), se añaden los atajos del teclado: "flecha arriba" para arrastrar la barra hacia arriba y "flecha abajo" para lo contrario, "flecha izquierda" para capitulo anterior y "flecha derecha" para el siguiente, tambien añade un boton de lupa.  
// @author       Tomas
// @match        https://zonetmo.com/leer/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523978/Peque%C3%B1o%20manager%20para%20personalizar%20y%20hacer%20mas%20agradable%20la%20lectura%20de%20Mangas.user.js
// @updateURL https://update.greasyfork.org/scripts/523978/Peque%C3%B1o%20manager%20para%20personalizar%20y%20hacer%20mas%20agradable%20la%20lectura%20de%20Mangas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Establecer el timeout de 1 segundo (1000 milisegundos)
    setTimeout(() => {

        const getImageSize = () => {
            const img = document.querySelector('div.image-alls img');
            return {
                width: img ? img.width : 0,
                height: img ? img.height : 0
            };
        };

        // Obtener el tamaño actual de la imagen
        const { width: currentWidth, height: currentHeight } = getImageSize();
        let lastFocusedField = null;
        let isMinimized = true;
        // Variables para los tamaños por defecto (si son 0 no se muestran en los inputs)
        const defaultWidth = 290;
        const defaultHeight = 0;
        // Cantidad de desplazamiento en píxeles por cada flecha
        const scrollAmount = 100;

        // Función para cambiar el tamaño de las imágenes
        const alignImages = () => {
            const images = document.querySelectorAll('div.image-alls img');
            const container = document.querySelector('div.image-alls');
            if (container) {
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.alignItems = 'center';
            }
            images.forEach(img => {
                img.style.display = 'block';
                img.style.marginBottom = '0';
            });
        };

        const getMostVisibleImage = () => {
            const images = document.querySelectorAll('div.image-alls img');
            let mostVisibleImage = null;
            let maxVisibleArea = 0;

            images.forEach(img => {
                const rect = img.getBoundingClientRect();
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
                const visibleArea = Math.max(0, visibleHeight) * Math.max(0, visibleWidth);

                if (visibleArea > maxVisibleArea) {
                    maxVisibleArea = visibleArea;
                    mostVisibleImage = img;
                }
            });

            return mostVisibleImage;
        };

        const adjustScrollToImage = (image) => {
            if (!image) return;

            const rect = image.getBoundingClientRect();
            const currentScroll = window.scrollY;
            const targetScroll = currentScroll + rect.top - (window.innerHeight / 2) + (rect.height / 2);

            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        };

        const changeSize = (width, height) => {
            const mostVisibleImage = getMostVisibleImage();
            const images = document.querySelectorAll('div.image-alls img');
            images.forEach(img => {
                // Verificar si width y height son inputs o números
                const newWidth = typeof width === 'object' ? parseInt(width.value) : width;
                const newHeight = typeof height === 'object' ? parseInt(height.value) : height;

                if (defaultWidth !== 0 && !isNaN(newWidth)) {
                    img.style.width = `${newWidth}px`;
                }
                if (defaultHeight !== 0 && !isNaN(newHeight)) {
                    img.style.height = `${newHeight}px`;
                }

                // Si alguna dimensión está en 0, mantener el tamaño original
                if (defaultWidth === 0) {
                    img.style.width = '';
                }
                if (defaultHeight === 0) {
                    img.style.height = '';
                }
            });
            alignImages();
            adjustScrollToImage(mostVisibleImage);
        };

        function toggleContainerSize(container, inputWidth, inputHeight, button, labelWidth, labelHeight, toggleButton,zoomButton, minimize) {
            if (minimize) {
                // Minimizar
                isMinimized = true;
                container.style.width = '40px';  // Ajustar el ancho mínimo
                container.style.height = '40px'; // Ajustar el alto mínimo
                inputWidth.style.display = 'none';
                inputHeight.style.display = 'none';
                button.style.display = 'none';
                labelWidth.style.display = 'none';
                labelHeight.style.display = 'none';
                zoomButton.style.display = "none";
                toggleButton.textContent = '➡';
                document.body.focus();
            } else {
                // Maximizar
                isMinimized = false;
                container.style.width = 'auto';  // Tamaño original
                container.style.height = 'auto'; // Tamaño original
                inputWidth.style.display = 'block';
                inputHeight.style.display = 'block';
                button.style.display = 'block';
                labelWidth.style.display = 'block';
                labelHeight.style.display = 'block';
                zoomButton.style.display = "flex";
                toggleButton.textContent = '⬅';

                // Si hay un campo previamente enfocado, darle foco nuevamente
                if (lastFocusedField) {
                    lastFocusedField.focus();
                } else {
                    // Si no hay campo previamente enfocado, enfocar el primero
                    inputWidth.focus();
                }
            }
        }

        function createContainer(){
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '10px';
            container.style.right = '10px';
            container.style.zIndex = '10000';
            container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            container.style.border = '1px solid #ccc';
            container.style.padding = '10px';
            container.style.borderRadius = '5px';
            container.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.2)';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '5px';
            container.style.overflow = 'hidden';
            return container;
        }

        function createLabels(){
            const labelWidth = document.createElement('div');
            labelWidth.textContent = 'Ancho';
            labelWidth.style.fontWeight = 'bold';
            labelWidth.style.marginBottom = '5px';

            // Crear la etiqueta para el alto
            const labelHeight = document.createElement('div');
            labelHeight.textContent = 'Alto';
            labelHeight.style.fontWeight = 'bold';
            labelHeight.style.marginBottom = '5px';

            return {labelWidth,labelHeight};
        }

        function createToggleButton(){
            const toggleButton = document.createElement('button');
            toggleButton.textContent = '⬅';
            toggleButton.style.padding = '3px';
            toggleButton.style.height = '20px';
            toggleButton.style.width = '20px';  // Definir un ancho fijo
            toggleButton.style.border = 'none';
            toggleButton.style.backgroundColor = '#007BFF';
            toggleButton.style.color = 'white';
            toggleButton.style.borderRadius = '50%'; // Hacer el botón circular
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.position = 'absolute'; // Mantener la flecha en la misma posición
            toggleButton.style.top = '10px';
            toggleButton.style.right = '10px';
            toggleButton.style.display = 'flex';
            toggleButton.style.alignItems = 'center';
            toggleButton.style.justifyContent = 'center';

            return toggleButton;
        }

        function createInputs(){
            const inputWidth = document.createElement('input');
            inputWidth.type = 'text';
            if(defaultWidth == 0){
                inputWidth.placeholder = `${currentWidth} px`;
            }else{
                inputWidth.placeholder = `${defaultWidth} px`;
                inputWidth.value = defaultWidth;
            }
            inputWidth.style.width = '100px';
            inputWidth.style.padding = '5px';
            inputWidth.style.border = '1px solid #ccc';
            inputWidth.style.borderRadius = '3px';

            // Crear el campo de texto para el alto
            const inputHeight = document.createElement('input');
            inputHeight.type = 'text';
            if(defaultHeight == 0){
                inputHeight.placeholder = `${currentHeight} px`;
            }else{
                inputHeight.placeholder = `${defaultHeight} px`;
                inputHeight.value = defaultHeight;
            }
            inputHeight.style.width = '100px';
            inputHeight.style.padding = '5px';
            inputHeight.style.border = '1px solid #ccc';
            inputHeight.style.borderRadius = '3px';

            const validateInput = (event) => {
                let value = event.target.value;
                // Eliminar caracteres no numéricos
                value = value.replace(/[^0-9]/g, '');
                // Asegurar que el número no sea negativo
                if (parseInt(value) < 0) {
                    value = '0';
                }
                event.target.value = value;
            };

        // Validar los inputs en tiempo real
            inputWidth.addEventListener('input', validateInput);
            inputWidth.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    changeSize(inputWidth, inputHeight);
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    // Solo ajustar el número en el textfield, no cambiar el tamaño de la imagen
                    let currentWidth = parseInt(inputWidth.value) || parseInt(inputWidth.placeholder);
                    if (event.key === 'ArrowLeft' && currentWidth > 0) {
                        currentWidth -= 40;
                        // Asegurarse de que no se vuelva negativo
                        if (currentWidth < 0) {
                            currentWidth = 0;
                        }
                    } else if (event.key === 'ArrowRight') {
                        currentWidth += 40;
                    }
                    inputWidth.value = currentWidth;  // Actualizar el campo de texto con el nuevo valor
                }
                lastFocusedField = inputWidth;  // Guardar el campo que tuvo el foco
            });
            inputWidth.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown') {
                    inputHeight.focus();
                    event.preventDefault();  // Evitar el comportamiento por defecto (scroll de la página)
                }
            });
            inputHeight.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    changeSize(inputWidth, inputHeight);
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    // Solo ajustar el número en el textfield, no cambiar el tamaño de la imagen
                    let currentHeight = parseInt(inputHeight.value) || parseInt(inputHeight.placeholder);
                    if (event.key === 'ArrowLeft' && currentHeight > 0) {
                        currentHeight -= 40;
                        // Asegurarse de que no se vuelva negativo
                        if (currentHeight < 0) {
                            currentHeight = 0;
                        }
                    } else if (event.key === 'ArrowRight') {
                        currentHeight += 40;
                    }
                    inputHeight.value = currentHeight;  // Actualizar el campo de texto con el nuevo valor
                }
                lastFocusedField = inputHeight;  // Guardar el campo que tuvo el foco
            });
            inputHeight.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowUp') {
                    inputWidth.focus();
                    event.preventDefault();  // Evitar el comportamiento por defecto (scroll de la página)
                }
            });
            inputHeight.addEventListener('input', validateInput);
            return { inputWidth, inputHeight };
        }

        function createAcceptButton(){
            const button = document.createElement('button');
            button.textContent = 'Cambiar';
            button.style.padding = '5px 10px';
            button.style.border = 'none';
            button.style.backgroundColor = '#007BFF';
            button.style.color = 'white';
            button.style.borderRadius = '3px';
            button.style.cursor = 'pointer';

            // Función para cambiar el tamaño de las imágenes
            button.addEventListener('click', () => changeSize(inputWidth, inputHeight));
            return button
        }

        function appendListenersToDocument(){
            document.addEventListener('keydown', (event) => {
                if (document.activeElement === document.body) {  // Solo si el foco está en la página
                    if (event.key === 'ArrowUp') {
                        window.scrollBy(0, -scrollAmount);  // Mover hacia arriba según scrollAmount
                        event.preventDefault();
                    }
                    if (event.key === 'ArrowDown') {
                        window.scrollBy(0, scrollAmount);  // Mover hacia abajo según scrollAmount
                        event.preventDefault();
                    }
                }
            });
            document.addEventListener('keydown', (event) => {
                if (document.activeElement === document.body) {  // Solo si el foco está en la página
                    if (event.key === 'ArrowLeft') {
                        // Hacer click en el enlace del capítulo anterior
                        const prevChapterLink = document.querySelector('div.left a');
                        if (prevChapterLink) {
                            prevChapterLink.click();
                        }
                        event.preventDefault();  // Evitar el comportamiento por defecto
                    }
                    if (event.key === 'ArrowRight') {
                        // Hacer click en el enlace del siguiente capítulo
                        const nextChapterLink = document.querySelector('div.right a');
                        if (nextChapterLink) {
                            nextChapterLink.click();
                        }
                        event.preventDefault();  // Evitar el comportamiento por defecto
                    }
                }
            });
        }

       function createZoomButton() {
           const zoomButton = document.createElement('button');
           zoomButton.textContent = '🔍';
           zoomButton.style.height = '25px';
           zoomButton.style.width = '25px';
           zoomButton.style.border = 'none';
           zoomButton.style.backgroundColor = '#007BFF';
           zoomButton.style.color = 'white';
           zoomButton.style.borderRadius = '50%';
           zoomButton.style.display = 'flex';
           zoomButton.style.alignItems = 'center';
           zoomButton.style.justifyContent = 'center';
           zoomButton.style.cursor = 'pointer';

           let zoomLens = null;
           let isZoomActive = false; // Estado del zoom
           let onMouseMove; // Variable para guardar el evento

           const enableZoom = () => {
               const container = document.querySelector('div.image-alls');
               if (!container) return;

               // Crear el lente de zoom si no existe
               if (!zoomLens) {
                   zoomLens = document.createElement('div');
                   zoomLens.style.position = 'absolute';
                   zoomLens.style.border = '2px solid #000';
                   zoomLens.style.width = '150px';
                   zoomLens.style.height = '150px';
                   zoomLens.style.overflow = 'hidden';
                   zoomLens.style.pointerEvents = 'none';
                   zoomLens.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                   zoomLens.style.zIndex = '1000';
                   document.body.appendChild(zoomLens);
               }

               // Evento para mover el lente con el cursor
               onMouseMove = (e) => {
                   const rect = container.getBoundingClientRect();
                   const offsetX = e.clientX - rect.left;
                   const offsetY = e.clientY - rect.top;

                   // Limitar el lente dentro del contenedor
                   if (offsetX > 0 && offsetX < rect.width && offsetY > 0 && offsetY < rect.height) {
                       zoomLens.style.left = `${e.pageX - zoomLens.offsetWidth / 2}px`;
                       zoomLens.style.top = `${e.pageY - zoomLens.offsetHeight / 2}px`;
                       zoomLens.style.display = 'block';

                       // Calcular el zoom y mover las imágenes dentro del lente
                       const images = document.querySelectorAll('div.image-alls img');
                       images.forEach(img => {
                           const imgRect = img.getBoundingClientRect();
                           if (
                               e.pageX >= imgRect.left &&
                               e.pageX <= imgRect.right &&
                               e.pageY >= imgRect.top &&
                               e.pageY <= imgRect.bottom
                           ) {
                               const zoomFactor = 2; // Factor de zoom
                               const imgOffsetX = offsetX - (imgRect.left - rect.left);
                               const imgOffsetY = offsetY - (imgRect.top - rect.top);

                               zoomLens.style.backgroundImage = `url(${img.src})`;
                               zoomLens.style.backgroundSize = `${img.width * zoomFactor}px ${img.height * zoomFactor}px`;
                               zoomLens.style.backgroundPosition = `-${imgOffsetX * zoomFactor}px -${imgOffsetY * zoomFactor}px`;
                           }
                       });
                   } else {
                       zoomLens.style.display = 'none';
                   }
               };

               // Activar el seguimiento del cursor
               container.addEventListener('mousemove', onMouseMove);

               // Desactivar el lente al salir del contenedor
               container.addEventListener('mouseleave', () => {
                   if (zoomLens) zoomLens.style.display = 'none';
               });
           };

           const disableZoom = () => {
               const container = document.querySelector('div.image-alls');
               if (!container || !onMouseMove) return;

               // Eliminar el evento de movimiento y ocultar el lente
               container.removeEventListener('mousemove', onMouseMove);
               if (zoomLens) {
                   zoomLens.remove();
                   zoomLens = null;
               }
           };

           zoomButton.addEventListener('click', () => {
               isZoomActive = !isZoomActive; // Alternar estado
               if (isZoomActive) {
                   enableZoom();
                   zoomButton.textContent = '❌'; // Cambiar icono
               } else {
                   disableZoom();
                   zoomButton.textContent = '🔍'; // Cambiar icono
               }
           });

           return zoomButton;
       }

        const container = createContainer();
        const { inputWidth, inputHeight } = createInputs();
        const acceptButton = createAcceptButton();
        const {labelWidth,labelHeight} = createLabels();
        const toggleButton = createToggleButton();
        const zoomButton = createZoomButton();

        toggleButton.addEventListener('click', () => {
            toggleContainerSize(container,inputWidth,inputHeight,acceptButton,labelWidth,labelHeight,toggleButton,zoomButton,!isMinimized);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === '-') {
                toggleContainerSize(container,inputWidth,inputHeight,acceptButton,labelWidth,labelHeight,toggleButton,zoomButton,!isMinimized);
            }
        });

        container.appendChild(toggleButton);
        container.appendChild(zoomButton);
        container.appendChild(labelWidth);
        container.appendChild(inputWidth);
        container.appendChild(labelHeight);
        container.appendChild(inputHeight);
        container.appendChild(acceptButton);
        document.body.appendChild(container);

        changeSize(defaultWidth, defaultHeight);

    }, 1000); // Espera de 1 segundo para asegurar que la página haya cargado
})();
