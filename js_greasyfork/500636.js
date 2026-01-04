// ==UserScript==
// @name            Neopets: Neocash Gift User Validator
// @name:es         Neopets: Validador de usuarios para regalos de neocréditos
// @namespace       Nyu@Clraik
// @version         1.1
// @description     When sending a neocash (nc) item by giftbox, you can validate the user.
// @description:es  Cuando regales objetos de neocréditos, puedes validar el usuario.
// @author          Nyu
// @match           *://*.neopets.com/inventory.phtml
// @icon            https://images.neopets.com/themes/014_yel_d187b/events/item.png
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/500636/Neopets%3A%20Neocash%20Gift%20User%20Validator.user.js
// @updateURL https://update.greasyfork.org/scripts/500636/Neopets%3A%20Neocash%20Gift%20User%20Validator.meta.js
// ==/UserScript==

(async () => {
    await handleGiftBoxes()

    const toggleButton = document.querySelector('.nptoggle')
    toggleButton.addEventListener('click', async () => {
        await handleGiftBoxes()
    })

    async function handleGiftBoxes() {
        await wait(1000)
        if(document.querySelector('.inv-nc-icon-container.invfilter-active')) {
            await waitForLoadingToComplete()
            const allBoxes = document.querySelectorAll('[data-isgift="true"]')
            allBoxes.forEach(box => {
                box.addEventListener('click', async () => {
                    while (document.getElementById('invDesc').style.display === 'none') {
                        await wait(1000)
                    }
                    await waitForLoadingToComplete();
                    document.getElementById('iteminfo_select_action').querySelector('.invitem-submit').addEventListener('click', async () => {
                        await waitForLoadingToComplete();
                        createValidationContainer()
                    })
                })
            })
        }
    }

    function createValidationContainer() {
        const button = document.createElement('div')
        button.textContent = 'Check user'
        button.classList = "button-default__2020 button-yellow__2020 btn-single__2020"
        button.style.maxWidth = '30%'
        button.style.cursor = 'pointer'
        button.onclick = async (e) => {
            e.preventDefault()
            const messageContainer = document.getElementById('ncUserValidator')
            messageContainer.style.display = 'none'
            const userInput = document.getElementById('newUser')
            const loadingImage = document.createElement('img')
            loadingImage.src = 'https://images.neopets.com/neoboards/avatars/foreverloading.gif'
            loadingImage.width = '20'
            document.getElementById('ncUserValidator').parentNode.insertBefore(loadingImage, document.getElementById('ncUserValidator').nextSibling)
            const userExistsRequest = await fetch(`https://www.neopets.com/neomail_block_check.phtml?background=%23F6F6F6&recipient=${userInput.value}`)
            const userExists = await userExistsRequest.text()
            loadingImage.style.display = 'none'
            messageContainer.style.display = 'block'
            if (userExists.includes('That user doesn\'t exist')) {
                messageContainer.style.color = 'darkred'
                messageContainer.innerText = 'The user you entered does not exist'
            }
            else if (userExists.includes('This user is frozen')) {
                messageContainer.style.color = 'darkred'
                messageContainer.innerText = 'The user you entered is frozen'
            }
            else {
                messageContainer.style.color = 'black'
                messageContainer.innerText = 'This user looks ok!'
            }
        }


        const messageContainer = document.createElement('div')
        messageContainer.id = 'ncUserValidator'
        messageContainer.style.padding = '0 8px'
        messageContainer.style.fontSize = 'small'
        messageContainer.style.marginBlock = '8px'
        messageContainer.style.borderRadius = '8px'

        const userInput = document.getElementById('newUser')
        userInput.parentNode.insertBefore(messageContainer, userInput.nextSibling)
        userInput.parentNode.insertBefore(button, userInput.nextSibling)
    }

    async function waitForLoadingToComplete() {
        let isLoading = document.querySelector('.inv-loading-static')
        while (isLoading) {
            await wait(1000)
            isLoading = document.querySelector('.inv-loading-static')
        }
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();