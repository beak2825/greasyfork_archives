// ==UserScript==
// @name         createModal
// @namespace    Violentmonkey Scripts
// @description  Create-Modal
// @version      1.1
// @author       maanimis
// @grant        none
// ==/UserScript==

/**
 * createModal
 *
 * @param {string} title
 * @param {string} initialText
 * @param {string} updatedText
 * @param {number} updateDelay
 * @returns {Promise<Element>}
 */
class Modal {
  constructor(title, initialText, updatedText, updateDelay) {
    this.title = title;
    this.initialText = initialText;
    this.updatedText = updatedText;
    this.updateDelay = updateDelay;

    this.createModal();
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.id = 'myModal';
    Object.assign(this.modal.style, {
      position: 'fixed',
      zIndex: '1000',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      backdropFilter: 'blur(10px)',
      direction: 'ltr',
    });

    this.modalContent = document.createElement('div');
    Object.assign(this.modalContent.style, {
      backgroundColor: '#fff',
      margin: 'auto',
      padding: '20px',
      border: '1px solid #888',
      width: '80%',
      maxWidth: '500px',
      borderRadius: '5px',
      direction: 'ltr',
    });

    this.closeButton = document.createElement('span');
    this.closeButton.innerHTML = '&times;';
    Object.assign(this.closeButton.style, {
      color: '#aaa',
      float: 'right',
      fontSize: '28px',
      fontWeight: 'bold',
      cursor: 'pointer',
    });
    this.closeButton.onclick = () => this.closeModal();

    this.modalTitle = document.createElement('h2');
    this.modalTitle.innerText = this.title;

    this.modalText = document.createElement('p');
    this.modalText.innerText = this.initialText;

    this.modalContent.appendChild(this.closeButton);
    this.modalContent.appendChild(this.modalTitle);
    this.modalContent.appendChild(this.modalText);
    this.modal.appendChild(this.modalContent);
    document.body.appendChild(this.modal);

    this.openModal();

    if (this.updateDelay) setTimeout(() => this.updateText(), this.updateDelay);

    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    };
  }

  openModal() {
    this.modal.style.display = 'flex';
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  updateText() {
    this.modalText.innerText = this.updatedText;
  }
}

