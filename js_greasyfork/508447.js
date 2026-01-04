// ==UserScript==
// @name         JVC_ImageViewer
// @namespace    http://tampermonkey.net/
// @version      2.0.9
// @description  Naviguer entre les images d'un post sous forme de slideshow en cliquant sur une image sans ouvrir NoelShack.
// @author       HulkDu92
// @match        https://*.jeuxvideo.com/forums/*
// @match        https://*.jeuxvideo.com/profil/*
// @match        https://*.jeuxvideo.com/messages-prives/*
// @match        https://jvarchive.com/*
// @match        https://jvarchive.st/*
// @require      https://cdn.jsdelivr.net/npm/panzoom@9.4.3/dist/panzoom.min.js
// @grant        GM_download
// @grant        GM.xmlHttpRequest
// @connect      image.noelshack.com
// @run-at       document-end
// @license      MIT
// @icon         https://image.noelshack.com/fichiers/2024/41/3/1728506420-image-viewer-icon.png
// @downloadURL https://update.greasyfork.org/scripts/508447/JVC_ImageViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/508447/JVC_ImageViewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

  class Panzoom {
        constructor(imgElement, callbacks = {}) {
            this.imgElement = imgElement;

            this.imageElementScale = 1;
            this.isDragging = false;
            this.isSwiping = false;
            this.busy = false;

            this.timeoutIdBusy = null;
            this.timeoutIdZooming = null;
            this.timeoutIdPanning = null;

            // Attribuer des callbacks par défaut
            // TODO remplacer ça par l'emission de signaux "swipe next", "swipe right" , "swipe close"
            this.showPreviousImage = callbacks.showPreviousImage || (() => {});
            this.showNextImage = callbacks.showNextImage || (() => {});
            this.closeViewer = callbacks.closeViewer || (() => {});


           if (imgElement.complete) {
                this.initializePanzoom();
            } else {
                imgElement.onload = this.initializePanzoom;
            }
        }

        initializePanzoom() {
            this.panzoomInstance = panzoom(this.imgElement, {
                                  contain: 'inside',
                                  bounds: true,
                                  boundsPadding: 1,
                                  zoomDoubleClickSpeed: 1,
                                  panOnlyWhenZoomed: true,
                                  smoothScroll: true,
                                  startScale: 1,
                              });
            this.panzoomInstance.setMinZoom(1);

             // Ecouter l'événement 'zoom' pour mettre à jour l'échelle
            this.panzoomInstance.on('zoom', (e) => {
                const transform = e.getTransform();
                this.imageElementScale = transform.scale;
                this.imgElement.parentElement.style.zIndex = this.imageElementScale > 1 ? 10002 : '';

                this.isZooming = true;
                clearTimeout(this.timeoutIdZooming); // Réinitialise le timer si un nouveau zoom survient
                this.timeoutIdZooming = setTimeout(() => {
                  this.isZooming = false;
                }, 250);
            });

            this.panzoomInstance.on('transform', () => {
                // console.log("busy");
                this.markBusy.bind(this);
            });

            // Ecouteur pour le pan
            this.panzoomInstance.on('panstart', () => {
                this.isDragging = true;
            });

            this.panzoomInstance.on('panend', () => {
                // Attendre un court délai avant de remettre isDragging à false
              clearTimeout(this.timeoutIdPanning); // Réinitialise le timer si un nouveau zoom survient
              this.timeoutIdPanning = setTimeout(() => {
                this.isDragging = false;
              }, 250);
            });

            // Ajout des écouteurs d'événements tactiles pour le swipe
            this.imgElement.addEventListener('touchstart', (event) => this.handleTouchEvent(event));
            this.imgElement.addEventListener('touchmove', (event) => this.handleTouchEvent(event));
            this.imgElement.addEventListener('touchend', (event) => this.handleTouchEvent(event));
        }

        reset() {
          this.resetZoom();
          this.resetDrag();
        }

     /*   destroy() {
            this.panzoomInstance.off('transform', this.markBusy.bind(this));
            this.panzoomInstance.destroy();
        }
*/
        markBusy() {
            this.busy = true;
            clearTimeout(this.timeoutIdBusy); // Réinitialise le timer si une nouvelle transformation survient
            this.timeoutIdBusy = setTimeout(() => {
              this.busy = false;
            }, 250);
        }

        isBusy() {
            // console.log("isBusy: ", this.busy || this.isSwiping || this.isDragging);
            return this.busy || this.isSwiping || this.isDragging || this.isZooming;
        }

        resetZoom() {
            this.panzoomInstance.zoomAbs(0, 0, 1);
            this.imgElement.style.transform = 'scale(1)';
            this.imgElement.style.transformOrigin = 'center center';
            this.imgElement.parentElement.style.zIndex = '';
        }

        // Réinitialiser la position du drag de l'image
        resetDrag() {
            this.imgElement.style.left = '0px';
            this.imgElement.style.top = '0px';
        }

       handleTouchEvent(event) {
            switch (event.type) {
                case 'touchstart':
                    if (event.touches.length === 1) {
                        if (this.imageElementScale > 1) {
                            // Ne rien faire si l'image est zoomée
                        } else {
                            // Démarrer le swipe
                            this.handleSwipeStart(event);
                        }
                    }
                    break;

                case 'touchmove':
                    if (event.touches.length === 1) {
                        if (this.imageElementScale > 1) {
                            // Ne rien faire si l'image est zoomée
                        } else {
                            this.handleSwipeMove(event);
                        }
                    }
                    break;

                case 'touchend':
                    if (event.touches.length === 1) {
                        if (this.imageElementScale > 1) {
                            // Ne rien faire si l'image est zoomée
                        }
                    } else if (event.touches.length === 0) {
                        if (this.isSwiping) {
                            this.handleSwipeEnd(event);
                        }
                    }
                    break;
            }
        }

        handleSwipeStart(event) {
            if (event.touches.length === 1) {
                if (this.imageElementScale > 1 || this.isZooming) {
                    return; // Ne pas commencer le swipe si l'image est zoomée
                }
                //this.isSwiping = true;
                this.startX = event.touches[0].clientX;
                this.startY = event.touches[0].clientY;

                //this.imgElement.style.transition = 'none';
            }
        }

        handleSwipeMove(event) {
            if (event.touches.length === 1) {
                if (this.imageElementScale > 1 || this.isZooming) {
                    return; // Ne pas swipe si l'image est zoomée
                }
                this.isSwiping = true;
                this.currentX = event.touches[0].clientX;
                this.currentY = event.touches[0].clientY;

                const deltaX = this.currentX - this.startX;
                const deltaY = this.currentY - this.startY;

                if (this.imageElementScale === 1) {
                  // Appliquer le déplacement en fonction de la direction du swipe
                  if (Math.abs(deltaY) > Math.abs(deltaX)) {
                          // Swipe vertical
                          this.imgElement.style.transform = `translateY(${deltaY}px)`;
                          this.imgElement.style.opacity = Math.max(1 - Math.abs(deltaY) / 300, 0);

                  } else {
                      // Swipe horizontal
                      //this.imgElement.style.transform = `translateX(${deltaX}px)`;
                  }
                }
            }
        }

        handleSwipeEnd(event) {
            if (event.touches.length === 0) {
                this.initialDistance = null;
            }
            if (this.imageElementScale > 1 || this.isZooming) {
                    return; // Ne pas swipe si l'image est zoomée
            }
            if (this.isSwiping) {
                const deltaX = this.currentX - this.startX;
                const deltaY = this.currentY - this.startY;

                // Si le mouvement est suffisamment grand, on change d'image
                if (Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.showPreviousImage();
                    } else {
                        this.showNextImage();
                    }
                }

                if (this.imageElementScale === 1) {
                    // Si le mouvement est suffisamment grand verticalement, on ferme le visualiseur
                    if (Math.abs(deltaY) > 50) {
                        this.closeViewer();
                    } else {
                        this.imgElement.style.opacity = 1;
                        this.imgElement.style.transform = '';
                    }
                }

              setTimeout(() => {
                        this.isSwiping = false;
                    }, 50);
            }

            // Réinitialiser le zIndex
            this.imgElement.style.zIndex = '';
        }

      destroy() {
          if (this.panzoomInstance) {  // Check if panzoomInstance exists
            this.panzoomInstance.off('transform', this.markBusy.bind(this));
            this.panzoomInstance.dispose(); // Call the original panzoom library's destroy method
            this.panzoomInstance = null;  // Important to clear the reference
          }

            this.panzoomInstance.off('transform', this.markBusy.bind(this));
            this.panzoomInstance.destroy();
        }
  }

    class ImageViewer {
        constructor() {
            if (ImageViewer.instance) {
                return ImageViewer.instance;
            }

            this.images = [];
            this.currentIndex = 0;
            this.overlay = null;
            this.imgElement = null;
            this.spinner = null;
            this.prevButton = null;
            this.nextButton = null;
            this.closeButton = null;
            this.infoText = null;
            this.downloadButton = null;
            this.searchButton = null;
            this.optionButton = null;
            this.playPauseButton = null;
            this.fullScreenButton = null;
            this.freezeButton = null;
            this.indicatorsContainer = null;
            this.indicators = [];
            this.isViewerOpen = false;
            this.thumbnailPanel = null;
            this.previousThumbnail = null;
            this.defaultImageWidth = Math.min(window.innerWidth, 1200);
            this.panzoom = null;

            ImageViewer.instance = this;

            this.handlePopState = this.handlePopState.bind(this);

            this.createOverlay();
            this.updateImage();
        }

        // Crée et configure les éléments du visualiseur d'images (overlay, boutons, texte d'information, etc.)
        createOverlay() {
            this.overlay = this.createElement('div', {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000, //getElementZIndex('.header.js-header.header--affix', 10000),
            });

            this.imgElement = this.createElement('img', {
                transition: 'opacity 0.3s',
                opacity: 0,
                cursor: 'pointer',
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
                width: '100%', /* image box size as % of container, see step 1 */
                height: '100%',
            });

         this.imgContainer = this.createElement('div', {
                maxWidth: '90%',
                maxHeight: '80%',
          //      width: 'auto',  // Important: Allow width to adjust to content
           //     height: 'auto', // Important: Allow height to adjust to content
                display: 'flex', // Ensure flex layout to center the image
                justifyContent: 'center', // Horizontally center
                alignItems: 'center',     // Vertically center
            });
         this.imgContainer.appendChild(this.imgElement);

          this.spinner = this.createSpinner();
          this.prevButton = this.createButton('<', 'left');
          this.nextButton = this.createButton('>', 'right');
          this.closeButton = this.createCloseButton();
          this.infoText = this.createInfoText();

          this.downloadButton = this.createDownloadButton();
          this.searchButton = this.createSearchButton();
          this.optionButton = this.createOptionButton();

          this.thumbnailPanel = this.createThumbnailPannel();

          this.indicatorsContainer = this.createElement('div', {
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '10px 0',
              position: 'absolute',
              bottom: '40px',
          });

          // Ajouter ici la logique de placement en bas à droite
          const buttonContainer = this.createElement('div', {
              position: 'absolute',
              bottom: '30px',
              right: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              zIndex: 10001,
          });

          // Ajouter les boutons dans ce conteneur
          buttonContainer.append(this.searchButton, this.downloadButton, this.optionButton);

         this.playPauseButton = this.createPlayPauseButton();
         this.fullScreenButton = this.createFullScreenButton();
         this.freezeButton = document.createElement('div'); // Pour le moment pas de bouton utilisable  juste un element HTML vide

          // Conteneur pour les boutons de manipulation d'image
          const imageControlsContainer = this.createElement('div', {
              position: 'absolute',
              top: '80px',  // Ajuster la position verticale si nécessaire
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              zIndex: 10002,
          });

          imageControlsContainer.append(this.playPauseButton, this.fullScreenButton, this.closeButton);

          this.optionsMenu = this.createOptionsMenu(); // must be last
          this.overlay.append(
              this.imgContainer,
              this.spinner,
              this.infoText,
              this.prevButton,
              this.nextButton,
              imageControlsContainer,
             // this.closeButton,
              buttonContainer,  // Ajouter le conteneur de boutons à l'overlay
              this.indicatorsContainer
          );

          // Positionner le menu d'options à gauche de buttonContainer
          this.overlay.append(this.optionsMenu);

          // Événements associés aux boutons et à l'overlay
          this.resetHideButtons();
          this.addEventListeners();
          this.addInteractionListeners();

          document.body.appendChild(this.overlay);
        }

        // Crée un élément HTML avec des styles
        createElement(tag, styles = {}) {
            const element = document.createElement(tag);
            Object.assign(element.style, styles);
            return element;
        }

        // Crée le bouton précédent ou suivant
        createButton(text, position) {

          const isMobileDevice = isMobile();

          const button = this.createElement('button', {
              position: 'absolute',
              [position]: '5px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white !important',
              fontSize: isMobileDevice ? '18px' : '22px',//'22px',
              border: 'none',
              borderRadius: '50%',
              width:  isMobileDevice ? '35px' : '40px',//'40px',
              height: isMobileDevice ? '35px' : '40px',//'40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)',
              transition: 'background-color 0.3s, transform 0.3s'
          });


          //button.textContent = text;*
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('width', '24');
          svg.setAttribute('height', '24');
          svg.setAttribute('fill', 'white');

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', position === 'left'
              ? 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z' // Icône flèche gauche
              : 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z');  // Icône flèche droite
          svg.appendChild(path);
          button.appendChild(svg);

          this.addButtonEffects(button);

          return button;
      }

      createDownloadButton() {
          const isMobileDevice = isMobile();

          const button = this.createElement('button', {
              position: 'relative',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              fontSize: isMobileDevice ? '12px' : '10px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              padding: '0',
              cursor: 'pointer',
              zIndex: 10001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobileDevice ? '37px' : '45px',
              height: isMobileDevice ? '37px' : '45px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
          });
          button.setAttribute('title', 'Enregistrer l\'image');

          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('width', isMobileDevice ? '18' : '22');
          svg.setAttribute('height', isMobileDevice ? '18' : '22');
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
          svg.setAttribute('stroke-linecap', 'round');
          svg.setAttribute('stroke-linejoin', 'round');
          svg.setAttribute('stroke-width', '2');

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', 'M6 21h12M12 3v14m0 0l5-5m-5 5l-5-5');

          svg.appendChild(path);
          button.appendChild(svg);
          this.addButtonEffects(button);

          return button;
      }

      createSearchButton() {
          const isMobileDevice = isMobile();

          const button = this.createElement('button', {
              position: 'relative',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              fontSize: isMobileDevice ? '12px' : '10px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              padding: '0',
              cursor: 'pointer',
              zIndex: 10001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobileDevice ? '37px' : '45px',
              height: isMobileDevice ? '37px' : '45px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
          });
         button.setAttribute('title', 'Rechercher par image');


          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          svg.setAttribute('width', isMobileDevice ? '18' : '22');
          svg.setAttribute('height', isMobileDevice ? '18' : '22');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('fill', 'currentColor');

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('fill', 'currentColor');
          path.setAttribute('d', 'M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5l-2-2zm-1.5 5h-11l2.75-3.53l1.96 2.36l2.75-3.54zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42L22.42 12L19.3 8.89zM15.5 9a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z');

          svg.appendChild(path);
          button.appendChild(svg);

          button.addEventListener('click', () => this.searchImageOnGoogle());

          this.addButtonEffects(button);

          return button;
      }


      createOptionButton() {
          const isMobileDevice = isMobile();

          const button = this.createElement('button', {
              position: 'relative',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white !important',
              fontSize: isMobileDevice ? '12px' : '10px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              padding: '0',
              cursor: 'pointer',
              zIndex: 10001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobileDevice ? '37px' : '45px',
              height: isMobileDevice ? '37px' : '45px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
          });
          button.setAttribute('title', 'Personnaliser');

          // Création du SVG avec trois points alignés verticalement
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('width', isMobileDevice ? '18' : '22');
          svg.setAttribute('height', isMobileDevice ? '18' : '22');
          svg.setAttribute('fill', 'currentColor');

          // Création des trois cercles pour les trois points
          const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle1.setAttribute('cx', '12');
          circle1.setAttribute('cy', '5');
          circle1.setAttribute('r', '2');

          const circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle2.setAttribute('cx', '12');
          circle2.setAttribute('cy', '12');
          circle2.setAttribute('r', '2');

          const circle3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle3.setAttribute('cx', '12');
          circle3.setAttribute('cy', '19');
          circle3.setAttribute('r', '2');

          // Ajout des cercles dans le SVG
          svg.appendChild(circle1);
          svg.appendChild(circle2);
          svg.appendChild(circle3);

          // Ajout du SVG dans le bouton
          button.appendChild(svg);

          // Créer le menu d'options
          //this.optionsMenu = this.createOptionsMenu();

          this.addButtonEffects(button);

          return button;
      }

        // Crée le bouton de fermeture
        createCloseButton() {
            const isMobileDevice = isMobile();

            const button = this.createElement('button', {
                position: 'relative',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                fontSize: isMobileDevice ? '18px' : '16px',
                //border: 'none',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                width: isMobileDevice ? '40px' : '35px',
                height: isMobileDevice ? '40px' : '35px',
                cursor: 'pointer',
                zIndex: 99999999
            });

           button.textContent = '✕';
           this.addButtonEffects(button);

          return button;
        }

        // Crée la zone d'affichage du texte d'information (numéro d'image)
        createInfoText() {
            return this.createElement('div', {
                position: 'absolute',
                //top: '80px',
                bottom: '0px',
                //left: '15px',
                right: '10px',
                color: 'white',
                fontSize: '12px',
                backgroundColor: 'rgba(5, 5, 5, 0.5)',
                padding: '5px',
                borderRadius: '5px',
                zIndex: 10001
            });
        }

        // Crée un spinner pour indiquer le chargement de l'image
        createSpinner() {
            const spinner = this.createElement('div', {
                position: 'absolute',
                border: '8px solid #f3f3f3',
                borderTop: '8px solid #3498db',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'spin 1s linear infinite',
                zIndex: 10001
            });
            return spinner;
        }

      createOptionsMenu() {
          const optionsMenu = this.createElement('div', {
              position: 'relative',
              backgroundColor: 'rgba(5, 5, 5, 0.8)',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              zIndex: 10001,
              display: 'none', // Caché par défaut
              flexDirection: 'column',
          });
          optionsMenu.style.position = 'absolute';
          optionsMenu.style.bottom = '20px';
          optionsMenu.style.right = '60px';

          optionsMenu.appendChild(this.createCheckboxOption(
              'Toujours afficher les boutons de navigation',
              false,
              this.freezeButton,
              (checked) => {
                  checked ? this.freezeButton.removeAttribute('data-hidden-by-options') : this.freezeButton.setAttribute('data-hidden-by-options', 'true');
              }
          ));

          optionsMenu.appendChild(this.createCheckboxOption(
              'Afficher le bouton de téléchargement',
              true,
              this.downloadButton,
              (checked) => {
                  this.downloadButton.style.display = checked ? 'block' : 'none';
                  checked ? this.downloadButton.removeAttribute('data-hidden-by-options') : this.downloadButton.setAttribute('data-hidden-by-options', 'true');
              }
          ));

          optionsMenu.appendChild(this.createCheckboxOption(
              'Afficher les miniatures',
              true,
              this.thumbnailPanel,
              (checked) => {
                  this.thumbnailPanel.style.display = checked ? 'block' : 'none';
                  checked ? this.thumbnailPanel.removeAttribute('data-hidden-by-options') : this.thumbnailPanel.setAttribute('data-hidden-by-options', 'true');
              }
          ));

          optionsMenu.appendChild(this.createCheckboxOption(
              'Afficher le bouton Google Lens',
              false,
              this.searchButton,
              (checked) => {
                  this.searchButton.style.display = checked ? 'block' : 'none';
                  checked ? this.searchButton.removeAttribute('data-hidden-by-options') : this.searchButton.setAttribute('data-hidden-by-options', 'true');
              }
          ));
          optionsMenu.appendChild(this.createCheckboxOption(
              'Afficher le bouton Full Screen',
              false,
              this.fullScreenButton,
              (checked) => {
                  this.fullScreenButton.style.display = checked ? 'block' : 'none';
                  checked ? this.fullScreenButton.removeAttribute('data-hidden-by-options') : this.fullScreenButton.setAttribute('data-hidden-by-options', 'true');
              }
          ));
          optionsMenu.appendChild(this.createCheckboxOption(
              'Afficher le bouton Slide Auto',
              false,
              this.playPauseButton,
              (checked) => {
                  this.playPauseButton.style.display = checked ? 'block' : 'none';
                  checked ? this.playPauseButton.removeAttribute('data-hidden-by-options') : this.playPauseButton.setAttribute('data-hidden-by-options', 'true');
              }
          ));

          return optionsMenu;
      }

      // Fonction pour créer une option avec une case à cocher
      _createCheckboxOption(labelText, isChecked = false, elementDepend, onChange) {
          const container = this.createElement('div', {
              display: 'flex',
              alignItems: 'center',
              margin: '5px 0',
              cursor: 'pointer',
              userSelect: 'none',
          });

          const checkboxId = `jvcimageviwer-checkbox-${labelText.replace(/\s+/g, '-').toLowerCase()}`;

          // Mettre un drapeau indiquant si l'element doit etre caché ou pas si il y a eu une réponse dans le localStorage
          const storedValue = localStorage.getItem(checkboxId);
          if (storedValue !== null) {
              isChecked = (storedValue === "true");
          }

          if (elementDepend) {
              elementDepend.style.display = isChecked ? 'block' : 'none';
              isChecked ? elementDepend.removeAttribute('data-hidden-by-options')
                        : elementDepend.setAttribute('data-hidden-by-options', 'true');
          }

          const checkbox = this.createElement('input');
          checkbox.setAttribute('type', 'checkbox');
          checkbox.checked = isChecked;

          // Donne un ID unique à la case à cocher pour l'associer au label
          checkbox.setAttribute('id', checkboxId);

          // Écouteur d'événement pour changer la valeur
          checkbox.addEventListener('change', (e) => {
              onChange(e.target.checked);
              localStorage.setItem(checkboxId, e.target.checked);
          });

          const label = this.createElement('label');
          label.textContent = labelText;
          label.setAttribute('for', checkboxId);
          label.style.marginLeft = '10px';

          container.append(checkbox, label);

          // Ajout d'un écouteur d'événement sur le conteneur pour activer la case à cocher
          container.addEventListener('click', () => {
              if (event.target !== checkbox && event.target !== label) {
                  checkbox.checked = !checkbox.checked;
                  onChange(checkbox.checked);
                  localStorage.setItem(checkboxId, checkbox.checked);
              }
          });

          return container;
      }

      createCheckboxOption(labelText, isChecked = false, elementDepend, onChange) {
        const container = this.createElement('div', {
            display: 'flex',
            alignItems: 'center',
            margin: '5px 0',
            cursor: 'pointer',
            userSelect: 'none',
        });

        const checkboxId = `jvcimageviwer-checkbox-${labelText.replace(/\s+/g, '-').toLowerCase()}`;

        // Vérifier si une valeur est stockée dans le localStorage
        const storedValue = localStorage.getItem(checkboxId);
        if (storedValue !== null) {
            isChecked = (storedValue === "true");
        }

        // Gestion de l'affichage de l'élément dépendant
        if (elementDepend) {
            elementDepend.style.display = isChecked ? 'block' : 'none';
            isChecked ? elementDepend.removeAttribute('data-hidden-by-options')
                      : elementDepend.setAttribute('data-hidden-by-options', 'true');
        }

        const checkbox = this.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.checked = isChecked;
        checkbox.setAttribute('id', checkboxId);

        // Écouteur de changement sur la checkbox
        checkbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            localStorage.setItem(checkboxId, isChecked);

            if (typeof onChange === 'function') {
                onChange(isChecked);
            }

            if (elementDepend) {
                elementDepend.style.display = isChecked ? 'block' : 'none';
            }
        });

        const label = this.createElement('label');
        label.textContent = labelText;
        label.setAttribute('for', checkboxId);
        label.style.marginLeft = '10px';

        container.append(checkbox, label);

        // Ajout d'un écouteur d'événement sur le conteneur pour activer la case à cocher
        container.addEventListener('click', (event) => {
            if (event.target !== checkbox && event.target !== label) {
                checkbox.checked = !checkbox.checked;
                localStorage.setItem(checkboxId, checkbox.checked);

                if (typeof onChange === 'function') {
                    onChange(checkbox.checked);
                }

                if (elementDepend) {
                    elementDepend.style.display = checkbox.checked ? 'block' : 'none';
                }
            }
        });

        return container;
    }

      createPlayPauseButton() {
          const isMobileDevice = isMobile();

          const button = this.createElement('button', {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              fontSize: isMobileDevice ? '12px' : '10px',
              width: '37px',
              height: '37px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10001,
              backgroundImage: 'radial-gradient(circle, transparent 50%, rgba(255, 255, 255, 0.6) 50%)', // Ajout du dégradé radial
              backgroundSize: '200% 200%',
          });
          button.style.backgroundImage = 'linear-gradient(to right, rgba(255,255,255,0.6), rgba(255,255,255,0.6))'; // Couleur unie pour le balayage
          button.style.backgroundSize = '0% 100%'; // Initialement, la barre est invisible
          button.style.backgroundRepeat = 'no-repeat'; // Empêche la répétition du gradient

          // Conteneur pour l'icône SVG
          const iconContainer = this.createElement('div', {
              position: 'relative',
              zIndex: 1, // SVG au-dessus de l'animation
          });
          button.appendChild(iconContainer);
          button.iconContainer = iconContainer;

          // Initialiser l'icône play/pause
          this.updatePlayPauseButtonIcon(button);

          button.addEventListener('click', () => {
              this.togglePlayPause();
          });
          //this.addButtonEffects(button);

          return button;
      }

      createFullScreenButton() {
            const isMobileDevice = isMobile();

            const button = this.createElement('button', {
                position: 'relative',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                fontSize: isMobileDevice ? '12px' : '10px',
                padding: '0',
                cursor: 'pointer',
                zIndex: 10001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '37px',
                height: '37px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.3s ease, background-color 0.3s ease',
            });
            button.setAttribute('title', 'Plein écran');

            // SVG pour l'icône plein écran (vous pouvez le personnaliser)
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('width', isMobileDevice ? '18' : '22');
            svg.setAttribute('height', isMobileDevice ? '18' : '22');
            svg.setAttribute('fill', 'currentColor');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'); // Icône plein écran
            svg.appendChild(path);
            button.appendChild(svg);


            button.addEventListener('click', () => this.toggleFullScreen());
            this.addButtonEffects(button);

            return button;
        }


        toggleFullScreen() {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                this.imgElement.requestFullscreen(); // Met l'image en plein écran
            }
        }


      createThumbnailPannel() {
        const thumbnailPanel = this.createElement('div', {
              position: 'fixed',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '0px solid',
              padding: '0px',
              zIndex: '1010',
              maxHeight: '80px',
              maxWidth: '80%',
              overflowY: 'hidden',
              overflowX: 'auto',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
          });
        thumbnailPanel.classList.add('thumbnail-scroll-container');

        return thumbnailPanel;
      }

      addButtonEffects(button) {
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                button.style.color = 'black';
                button.style.transform = 'scale(1.1)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                button.style.color = 'white';
                button.style.transform = 'scale(1)';
            });

            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.9)';
            });

            button.addEventListener('mouseup', () => {
                button.style.transform = 'scale(1.1)';
            });
        }

      toggleMenuOptions() {
          if (this.optionsMenu.style.display === 'none') {
              this.optionsMenu.style.display = 'flex';
          } else {
              this.optionsMenu.style.display = 'none';
          }
      }

        // Ajoute les événements aux différents éléments du visualiseur
        addEventListeners() {
            // Bouttons de controles du visualiseur
            this.prevButton.addEventListener('click', () => this.changeImage(-1));
            this.nextButton.addEventListener('click', () => this.changeImage(1));
            this.closeButton.addEventListener('click', () => this.closeViewer());
            this.downloadButton.addEventListener('click', () => this.startDownload());
            this.optionButton.addEventListener('click', () => this.toggleMenuOptions());
            this.overlay.addEventListener('click', (event) => {
                if ((!this.panzoom || !this.panzoom.isBusy()) && event.target === this.overlay) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.closeViewer();
                }
            });

            // Touches du clavier
            document.addEventListener('keydown', (event) => this.handleKeyboardEvents(event));
        }

        // Fonctions pour gérer les touches du clavier
        handleKeyboardEvents(event) {
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    this.changeImage(-1);
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    this.changeImage(1);
                    break;
              case 'Escape':
                    event.preventDefault();
                    this.closeViewer();
                    break;
            }
        }

       resolveImageUrl(href) {
          const risibankUrl = new URL(href);
          if (risibankUrl.hostname === "risibank.fr" && risibankUrl.pathname.includes("/by-source")) {
            const directUrl = risibankUrl.searchParams.get("url");
            if (directUrl && (directUrl.includes("noelshack.com") || directUrl.includes("image.noelshack.com"))) {
              return directUrl;
            }
          }
          return href;
        }

        // Met à jour l'image affichée dans le visualiseur
          updateImage() {
            if (this.currentIndex >= 0 && this.currentIndex < this.images.length) {
              const rawUrl = this.images[this.currentIndex].href;
              const imageUrl = this.resolveImageUrl(rawUrl);

              this.imgElement.src = imageUrl;
              this.infoText.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
              this.spinner.style.display = 'block';

              this.toggleButtonState();

              this.imgElement.onload = () => {
                  this.imgElement.style.transition = 'opacity 0.2s ease-in-out'; // Transition pour l'opacité
                  this.imgElement.style.opacity = 1;
                  this.spinner.style.display = 'none';
                  this.imgElement.style.objectFit = 'contain';

                  // Réinitialiser le zoom et la position du drag
                 // this.panzoom.resetZoom();
                 // this.panzoom.resetDrag();

                  // Calcul de la position des boutons


                  this.focusOnThumbnail();

                   requestAnimationFrame(() => {  // Ensures layout is calculated
                      this.imgContainer.style.maxWidth = '90%';
                      this.imgContainer.style.maxHeight = '80%';
                      this.imgElement.style.objectFit = 'contain';

                      // Set the zoom utils
                      this.initializePanzoom();

                      // Reset container height first (important!)
                      this.imgContainer.style.height = 'auto'; // or '0px' if you need an initial value

                      const displayedImageHeight = this.imgElement.offsetHeight;
                      const containerHeight = this.imgContainer.offsetHeight;
                      // Changed container height if image bigger than container
                      if (displayedImageHeight > containerHeight) {
                          this.imgContainer.style.transition = 'height 0.3s ease-in-out'; // Adjust duration and easing as needed
                          this.imgContainer.style.height = `${displayedImageHeight}px`;
                      } else {
                          // Remove transition if height is not changing (optional but recommended)
                          this.imgContainer.style.transition = 'none';
                      }

                      // Modify buttons Next/Prev position
                      const imgRect = this.imgElement.getBoundingClientRect();
                      const isMobileDevice = isMobile(); // Détection des mobiles
                      if (imgRect.width > this.defaultImageWidth) {
                          this.defaultImageWidth = imgRect.width; // Default width value for button space
                      }
                      if (isMobileDevice) {
                        // pass
                      } else {
                        this.calculateButtonPositions(this.defaultImageWidth);
                      }
                  });



              };

              this.imgElement.onerror = () => this.handleImageError();
            }
        }

        updateContainerDimensions() {
                // Force reflow
                this.imgElement.offsetHeight;


               //const imgRect = targetImg.getBoundingClientRect();
              const imgWidth = this.imgElement.offsetWidth;
              const imgHeight = this.imgElement.offsetHeight;

              // Calculer la taille du conteneur en fonction des dimensions de l'image
              const maxHeight = window.innerHeight;

              const height = Math.min(imgHeight, maxHeight);
              this.imgContainer.style.height = `${height}px`;
              //this.imgContainer.style.border = "4px solid red";

      }

      // Gestion des erreurs de chargement d'image
      handleImageError() {
            const miniUrl = this.images[this.currentIndex].querySelector('img').src;
            const fullUrl = this.images[this.currentIndex].href;
            const extensions = this.reorderExtensions(fullUrl);
            const baseUrl = miniUrl.replace('/minis/', '/fichiers/');

            const tryNextExtension = (index) => {
                if (index >= extensions.length) {
                    // Si toutes les extensions échouent, tenter l'URL originale (mini)
                    const imgTestMini = new Image();
                    imgTestMini.src = miniUrl;

                    imgTestMini.onload = () => {
                        this.imgElement.src = miniUrl;
                    };
                    imgTestMini.onerror = () => {
                        this.setImageNotFound(this.imgElement); // si même l'url mini marche pas afficher logo IMAGE NOT FOUND
                    };
                    return;
                }

                // Remplacer l'extension et mettre à jour l'URL
                const updatedUrl = baseUrl.replace(/\.(jpg|png|jpeg|webp|gif)$/, extensions[index]);

                // Tester l'URL avec un élément Image temporaire
                const imgTest = new Image();
                imgTest.src = updatedUrl;

                imgTest.onload = () => {
                    this.imgElement.src = updatedUrl;
                };

                imgTest.onerror = () => {
                    // console.log("Error loading: " + updatedUrl);
                    tryNextExtension(index + 1);
                };
            };

            // Commencer les essais avec la première extension
            tryNextExtension(0);
        }

      calculateButtonPositions(imageWidth) { // Calculate button positions based on image width
            const margin = 30;

             // Calcul de la position des boutons
            let prevButtonLeft = (window.innerWidth - imageWidth) / 2 - this.prevButton.offsetWidth - margin;
            let nextButtonRight = (window.innerWidth - imageWidth) / 2 - this.nextButton.offsetWidth - margin;

             // Limite les boutons pour qu'ils ne sortent pas de l'écran à gauche ou à droite
            prevButtonLeft = Math.max(prevButtonLeft, margin);
            nextButtonRight = Math.max(nextButtonRight, margin);

            // Appliquer les positions ajustées
            this.prevButton.style.left = `${prevButtonLeft}px`;
            this.nextButton.style.right = `${nextButtonRight}px`;
      }

      initializePanzoom() {
           if (!this.panzoom) {
                this.panzoom = new Panzoom(this.imgElement, {
                    showPreviousImage: this.showPreviousImage.bind(this),
                    showNextImage: this.showNextImage.bind(this),
                    closeViewer: this.closeViewer.bind(this)
                });
            } else {
                this.panzoom.reset(); // Reset existing Panzoom instance
            }

      }


       setImageNotFound(imageElement) {
            const notFoundImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
            imageElement.src = notFoundImageUrl;
        }

        // Réarranger la liste des extensions a tester pour mettre l'extension utilisée sur noelshack en premier
       reorderExtensions(currentImageUrl) {
            const extensions = ['.jpg', '.png', '.jpeg'];
            const currentExtension = getImageExtension(currentImageUrl);
            const newExtensions = [...extensions];

            if (currentExtension) {
                if (!newExtensions.includes(currentExtension)) {
                    newExtensions.unshift(currentExtension);
                } else {
                    const index = newExtensions.indexOf(currentExtension);
                    if (index > -1) {
                        newExtensions.splice(index, 1);
                        newExtensions.unshift(currentExtension);
                    }
                }
            }
            return newExtensions;
        }

        // Change d'image en fonction de la direction (suivant/précédent)
        changeImage(direction) {
            this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
            this.imgElement.style.transition = 'opacity 0.2s ease-in-out'; // Transition pour l'opacité
            this.imgElement.style.opacity = 0;
            this.spinner.style.display = 'block';
            this.updateImage();
        }

        showPreviousImage() {
            this.changeImage(-1);
        }

        showNextImage() {
            this.changeImage(1);
        }

      // Désactive ou active les boutons suivant/précédent en fonction de l'index actuel
      toggleButtonState() {
          if (this.currentIndex === 0) {
              // this.prevButton.disabled = true;
              this.prevButton.style.opacity = 0.5;
              this.prevButton.style.cursor = 'initial';
          } else {
              // this.prevButton.disabled = false;
              this.prevButton.style.opacity = 1;
              this.prevButton.style.cursor = 'pointer';
          }

          if (this.currentIndex === this.images.length - 1) {
              // this.nextButton.disabled = true;
              this.nextButton.style.opacity = 0.5;
              this.nextButton.style.cursor = 'initial';
          } else {
              // this.nextButton.disabled = false;
              this.nextButton.style.opacity = 1;
              this.nextButton.style.cursor = 'pointer';
          }
      }

      // Cacher temporairement le menu JVC
      toggleMenuVisibility(isVisible) {
          const menu = document.querySelector('.header__bottom');
          if (menu) {
              menu.style.display = isVisible ? '' : 'none';
          }
      }

     focusOnThumbnail() {
          const thumbnails = this.thumbnailPanel ? this.thumbnailPanel.querySelectorAll('img') : [];
          const currentThumbnail = thumbnails[this.currentIndex];

          if (this.previousThumbnail == currentThumbnail) {
            return;
          }

          // Réinitialiser les styles de la miniature précédente en supprimant les classes
          if (this.previousThumbnail) {
              this.previousThumbnail.classList.remove('thumbnail-focus');
              this.previousThumbnail.classList.add('thumbnail-reset');
          }

          // Ajouter des effets à la miniature actuelle en ajoutant la classe 'thumbnail-focus'
          if (currentThumbnail) {
              currentThumbnail.classList.remove('thumbnail-reset');
              currentThumbnail.classList.add('thumbnail-focus');
              currentThumbnail.parentElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
          }

          // Mettre à jour la référence de la miniature précédente
          this.previousThumbnail = currentThumbnail;
      }


      // Fonction pour créer et afficher le panneau des miniatures
       toggleThumbnailPanel() {
          /*if (this.thumbnailPanel) {
              this.closeThumbnailPanel(); // Ferme le panneau si déjà ouvert
              return;
          }*/

          // Créer le panneau
          if(this.thumbnailPanel == null) {
            this.thumbnailPanel = this.createThumbnailPannel();
          }

          // Conteneur pour le défilement horizontal
          const scrollContainer = this.createElement('div', {
              display: 'flex',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
          });

          scrollContainer.classList.add('thumbnail-scroll-container');


          // Ajout des images au conteneur
          this.images.forEach((image, index) => {
              const imgContainer = this.createElement('div', {
                  display: 'inline-block',
                  width: '50px',
                  height: '50px',
                  margin: '5px 2px',
                  padding: '4px 0px',
                  transition: 'transform 0.3s',
              });

              const imgThumbElement = this.createElement('img');
              imgThumbElement.src = image.querySelector('img') ? image.querySelector('img').src : image.href || image.thumbnail;
              imgThumbElement.onerror = () => {
                  this.setImageNotFound(imgThumbElement);
              };

              imgThumbElement.alt = `Image ${index + 1}`;
              imgThumbElement.style.width = '50px';
              imgThumbElement.style.height = '100%';
              imgThumbElement.style.objectFit = 'cover';
              imgThumbElement.style.cursor = 'pointer';

              imgThumbElement.addEventListener('click', () => {
                  this.images.forEach((_, i) => {
                      const container = scrollContainer.children[i];
                      container.querySelector('img').style.border = 'none';
                  });
                  //imgElement.style.border = '2px solid blue';
                  this.currentIndex = index;
                  this.updateImage();
                  //imgContainer.scrollIntoView({ behavior: 'smooth', inline: 'center' });
              });

              imgContainer.appendChild(imgThumbElement);
              scrollContainer.appendChild(imgContainer);
          });

          this.thumbnailPanel.appendChild(scrollContainer);
          this.overlay.appendChild(this.thumbnailPanel);

          this.focusOnThumbnail();
      }

      togglePlayPause() {
          this.isPlaying = !this.isPlaying;
          this.updatePlayPauseButtonIcon(this.playPauseButton);

          if (this.isPlaying) {
              this.startSlideshow();
          } else {
              this.stopSlideshow();
          }
      }

      startSlideshow() {
          this.isPlaying = true;
          this.updatePlayPauseButtonIcon(this.playPauseButton);
          this.animateProgressFill();

          this.slideshowInterval = setInterval(() => {
              this.changeImage(1);
              this.animateProgressFill();
          }, 5000); // 5 secondes d'intervalle
      }

      stopSlideshow() {
          clearInterval(this.slideshowInterval);
          this.slideshowInterval = null;
          this.isPlaying = false;
          this.updatePlayPauseButtonIcon(this.playPauseButton);

          // Réinitialiser la barre de progression
          this.playPauseButton.style.animation = 'none';
          this.playPauseButton.style.backgroundSize = '0% 100%';
      }

      animateProgressFill() {
          this.playPauseButton.style.animation = 'none';
          void this.playPauseButton.offsetWidth;
          this.playPauseButton.style.animation = 'progressFill 5s linear forwards'; // forwards pour que l'animation reste à 100%
      }

      updatePlayPauseButtonIcon(button) {
          button.iconContainer.innerHTML = '';

          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('width', '20');
          svg.setAttribute('height', '20');
          svg.setAttribute('fill', 'white');

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', this.isPlaying ? 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' : 'M8 5v14l11-7z');
          svg.appendChild(path);
          button.iconContainer.appendChild(svg);
      }


      // Ecouteurs d'événements pour réinitialiser le timer
      addInteractionListeners() {
          this.overlay.addEventListener('mousemove', this.resetHideButtons.bind(this));
          this.overlay.addEventListener('click', this.resetHideButtons.bind(this));
          this.overlay.addEventListener('touchstart', this.resetHideButtons.bind(this));
          this.imgElement.addEventListener('touchstart', this.resetHideButtons.bind(this));
      }

      // Réinitialisez le timer pour cacher les boutons
      resetHideButtons() {
        if (this.hideButtonsTimeout) {
            clearTimeout(this.hideButtonsTimeout);
        }
        this.toggleButtonsVisibility(true);

        // Si option masquer boutons desactiver quitter ici
        if(this.freezeButton && !this.freezeButton.hasAttribute('data-hidden-by-options')){
          return;
        }
        // Sinon appliquer le masquage automatique
        this.hideButtonsTimeout = setTimeout(() => {
            this.toggleButtonsVisibility(false); // Cachez les boutons après 3 secondes
        }, 2500);
    }

      // Changez la visibilité des boutons
      toggleButtonsVisibility(visible) {
          const displayValue = visible ? 'flex' : 'none';

          const elements = [
              this.prevButton,
              this.nextButton,
              this.thumbnailPanel,
              this.infoText,
              this.downloadButton,
              this.searchButton,
              this.playPauseButton,
              this.fullScreenButton,
              this.optionButton,
          ];

          elements.forEach(element => {
              // Vérifiez si l'élément a été masqué par le système d'options
              if (element && element.hasAttribute('data-hidden-by-options')) {
                  // Si l'élément a été masqué par les options, ne pas le réafficher
                  element.style.display = 'none';
              } else if (element){
                  element.style.display = displayValue;
              }
          });

        /*if(!visible) {
          this.optionsMenu.style.display = displayValue;
        }*/
      }

    startDownload() {
        this.downloadButton.classList.add('downloading'); // Ajout de la classe pour l'animation

        this.downloadCurrentImage().then(() => {
            // Retirer la classe après le téléchargement
            this.downloadButton.classList.remove('downloading');
        }).catch((error) => {
            console.error('Download failed:', error);
            this.downloadButton.classList.remove('downloading');
        });
    }

    downloadCurrentImage() {
        return new Promise((resolve, reject) => {
            const imageElement = this.imgElement;
            if (!imageElement) {
                console.error('Image not found!');
                reject('Image not found');
                return;
            }

            const imageUrl = imageElement.src;
            const fileNameWithExtension = imageUrl.split('/').pop();
            const fileName = fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf('.'));

            // Utilisation de GM.xmlHttpRequest pour contourner CORS
            GM.xmlHttpRequest({
                method: "GET",
                url: imageUrl,
                responseType: "blob",
                headers: {
                    'Accept': 'image/jpeg,image/png,image/gif,image/bmp,image/tiff,image/*;q=0.8'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const blob = response.response;
                        const url = URL.createObjectURL(blob);

                        // Téléchargement du fichier
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);

                        resolve(); // Indique que le téléchargement est terminé
                    } else {
                        reject('Error downloading image: ' + response.statusText);
                    }
                },
                onerror: function(err) {
                    reject('Request failed: ' + err);
                }
            });
        });
    }

    searchImageOnGoogle() {
        if (this.images.length > 0) {
            const imageUrl = this.imgElement.src;
            const googleImageSearchUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl)}`;
            // Ouvrir le lien dans un nouvel onglet
            window.open(googleImageSearchUrl, '_blank');
        } else {
            console.error('Aucune image disponible pour la recherche.');
        }
    }

    disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    enableScroll() {
        document.body.style.overflow = '';
    }

      // Fonction pour fermer le panneau des miniatures
      closeThumbnailPanel(thumbnailPanel) {
              if (this.thumbnailPanel && this.overlay.contains(this.thumbnailPanel)) {
                  this.overlay.removeChild(this.thumbnailPanel);
                  this.thumbnailPanel = null;
              }
      }

      closeViewer() {
          if (this.overlay) {
              this.handleCloseViewer(); // Ferme le visualiseur
              history.back(); // Supprime l'état ajouté par pushState
          }
      }


      // Ferme le visualiseur d'images
      handleCloseViewer() {
          if (this.overlay) {
                document.body.removeChild(this.overlay);

                // Ferme le panneau des miniatures si ouvert
                if (this.thumbnailPanel) {
                    this.closeThumbnailPanel(this.thumbnailPanel);
                }

                window.removeEventListener('popstate', this.handlePopState);

                this.overlay = null;
                this.isViewerOpen = false;
                ImageViewer.instance = null; // Réinitialise l'instance singleton

                this.toggleMenuVisibility(true);
            }
        this.enableScroll();
      }

      openViewer(images, currentIndex) {
            if (this.overlay) {
                this.images = images;
                this.currentIndex = currentIndex;
                this.updateImage();
                this.toggleThumbnailPanel();
            } else {
                new ImageViewer();
                this.images = images;
                this.currentIndex = currentIndex;
                this.createOverlay();
                this.updateImage();
                this.toggleThumbnailPanel();
            }
            this.isViewerOpen = true;

            this.addHistoryState()
            window.addEventListener('popstate', this.handlePopState); // Ecouter l'événement bouton back du navigateur

            this.toggleMenuVisibility(false);
            this.disableScroll();
        }

        handlePopState(event) {
          if (ImageViewer.instance) {
                event.preventDefault();
                this.handleCloseViewer();
          }
        }

        // Ajouter une entrée dans l'historique
        addHistoryState() {
          history.pushState({ viewerOpen: true }, '');
        }
    }


class StyleInjector {
    constructor() {
        this.styleElement = document.createElement('style');
        document.head.appendChild(this.styleElement);
        this.isMobileDevice = isMobile();
    }


    addSpinnerStyles() {
        this.styleElement.textContent += `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .spinner {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: 5px solid transparent;
                border-top: 5px solid rgba(0, 0, 0, 0.1);
                background: conic-gradient(from 0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
                animation: spin 1s linear infinite;
            }
        `;
    }

    addDownloadButtonStyles() {
        this.styleElement.textContent += `
            @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .downloading {
                animation: rotate 1s linear infinite;
                background-color: rgba(0, 0, 0, 0.8);
                border-color: rgba(255, 255, 255, 0.5);
                opacity: 0.7;
            }
        `;
    }

    addScrollBarStyles() {
        if (!this.isMobileDevice) {
            this.styleElement.textContent += `
                .thumbnail-scroll-container::-webkit-scrollbar {
                    height: 7px;
                    background-color: transparent;
                }
                .thumbnail-scroll-container::-webkit-scrollbar-button {
                    display: none;
                }
                .thumbnail-scroll-container::-webkit-scrollbar-corner {
                    background-color: transparent;
                }
                .thumbnail-scroll-container::-webkit-scrollbar-thumb {
                    background-color: rgba(74, 77, 82, 0.7);
                    border: 2px solid transparent;
                    border-radius: 10px;
                }
                .thumbnail-scroll-container::-webkit-scrollbar-thumb:hover {
                    background-color: rgb(90, 93, 98, 0.7);
                }
            `;
        }
    }

    addPlayPauseStyles() {
        this.styleElement.textContent += `
            @keyframes progressFill {
                0% { background-size: 0% 100%; }
                100% { background-size: 100% 100%; }
            }
        `;
    }

    addThumbnailStyles() {
        this.styleElement.textContent += `
            .thumbnail-focus {
                transition: transform 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease;
                transform: scale(1.3);
                filter: brightness(1.15);
                z-index: 10;
                position: relative;
                border-radius: 2px;
            }
            .thumbnail-reset {
                border: none;
                transform: scale(1);
                box-shadow: none;
                filter: none;
                z-index: 1;
                position: relative;
                border-radius: 0px;
            }
        `;
    }

    injectAllStyles() {
        this.addSpinnerStyles();
        this.addDownloadButtonStyles();
        this.addPlayPauseStyles();
        this.addThumbnailStyles();
        this.addScrollBarStyles();
    }
}

    function injectStyles() {
      const styleInjector = new StyleInjector();
      styleInjector.injectAllStyles();
    }

    const parentClasses = `
        .txt-msg,
        .message,
        .conteneur-message.mb-3,
        .bloc-editor-forum,
        .signature-msg,
        .previsu-editor,
        .bloc-description-desc.txt-enrichi-desc-profil,
        .bloc-signature-desc.txt-enrichi-desc-profil,
        .message__noBlankline,
        .message-content,
        .messageEditor__containerPreview
    `.replace(/\s+/g, ''); // Supprimer les sauts de ligne et espaces inutiles

    const linkSelectors = parentClasses.split(',').map(cls => `${cls} a`);

    // Ajouter des écouteurs d'événements aux images sur la page
    function addListeners() {
        linkSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(link => {
                link.addEventListener('click', handleImageClick, true);
            });
        });
    }

    function handleImageClick(event) {
        // Si Ctrl ou Cmd est enfoncé, ne pas ouvrir l'ImageViewer
        if (event.ctrlKey || event.metaKey) {
            return;
        }

        const imgElement = this.querySelector('img');
        if (imgElement) {
            event.preventDefault();
            const closestElement = this.closest(parentClasses);
            if (closestElement) {
                const images = Array.from(closestElement.querySelectorAll('a')).filter(imgLink => imgLink.querySelector('img'));
                const currentIndex = images.indexOf(this);

                const viewer = new ImageViewer();
                viewer.openViewer(images, currentIndex);
            }
        }
    }

    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function getImageExtension(url) {
        const match = url.match(/\.(jpg|jpeg|png|gif|bmp|webp|tiff)$/i); // Regexp pour matcher les extensions d'images
        return match ? match[0].toLowerCase() : null;
    }

    // Observer les changements dans le DOM
    function observeDOMChanges() {
        const observer = new MutationObserver(() => addListeners());
        observer.observe(document, { childList: true, subtree: true });
    }

    // Détection des changements d'URL
    function observeURLChanges() {
        let lastUrl = window.location.href;

        const urlObserver = new MutationObserver(() => {
            if (lastUrl !== window.location.href) {
                lastUrl = window.location.href;
                addListeners();
            }
        });
        urlObserver.observe(document, { subtree: true, childList: true });
    }

    function main() {
        injectStyles();
        addListeners();
        observeDOMChanges();
        observeURLChanges();
    }

    main();

})();