// ==UserScript==
// @name Proton Mail Signature Remover
// @description Automatically removes email signature for free users of Proton Mail
// @version 2.0.10
// @author guihkx
// @match https://mail.protonmail.com/*
// @match https://mail.proton.me/*
// @run-at document-idle
// @license MIT; https://opensource.org/licenses/MIT
// @namespace https://github.com/guihkx
// @icon https://mail.proton.me/assets/favicon.ico
// @homepageURL https://github.com/guihkx/user-scripts
// @supportURL https://github.com/guihkx/user-scripts/issues
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/433406/Proton%20Mail%20Signature%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/433406/Proton%20Mail%20Signature%20Remover.meta.js
// ==/UserScript==

/**
 * Changelog:
 *
 * v2.0.10 (2025-01-03):
 * - Replace the "onload()" event from the rich-text composer iframe by periodic setInterval() checks.
 *
 * v2.0.9 (2024-09-20):
 * - Fix compatibility with Proton Mail v5.0.47.8.
 *
 * v2.0.8 (2024-01-11):
 * - Avoid deleting the custom user signature.
 *
 * v2.0.7 (2024-01-09):
 * - Remove debug statement.
 *
 * v2.0.6 (2024-01-09):
 * - Update selector for the HTML composer.
 * - Use 'instanceof' where applicable.
 *
 * v2.0.5 (2022-10-27):
 * - Fix script icon.
 *
 * v2.0.4 (2022-10-27):
 * - Fix compatibility with Proton Mail v5.0.10.
 * - Prevent script from running twice due to nested frames.
 *
 * v2.0.3 (2022-05-25):
 * - Fixed signature in text-mode editor, again (why do they keep changing it?)
 * - Added support for their new domain (mail.proton.me)
 * - Updated @icon metadata
 * - Replaced 'ProtonMail' by 'Proton Mail'
 *
 * v2.0.2 (2022-04-19):
 * - Updated a bunch of class names, so now the script should work again.
 * - Fixed signature detection in the text-only editor.
 *
 * v2.0.1 (2022-02-08):
 * - Fixed signature not being removed in the HTML composer ("rich text editor").
 * - Added logging for when a signature is found and removed.
 *
 * v2.0.0 (2021-10-03):
 * - Huge code rewrite
 * - Remove support for old.protonmail.com (Sorry!)
 * - Now removes the signature from both HTML and text-based emails (previously it could only do HTML-based ones)
 * - Updated script icon
 *
 * v1.0.0 (2020-04-28):
 * - First release
 */

;(() => {
  const log = console.log.bind(console, '[Proton Mail Signature Remover]')

  log('Waiting for the composer container...')

  const id = setInterval(() => {
    const composerContainer = document.querySelector('div.app-root > div:not([class]):last-child')

    if (composerContainer === null) {
      return
    }
    clearInterval(id)

    log('Ready.')

    const composerContainerMonitor = new MutationObserver(observeComposerContainer)
    composerContainerMonitor.observe(composerContainer, {
      childList: true
    })
  }, 500)

  function observeComposerContainer (mutations) {
    let composerFound = false
    let composerNode
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (!(addedNode instanceof HTMLElement)) {
          continue
        }
        if (!addedNode.classList.contains('composer')) {
          log('Unexpected non-composer node:', addedNode)
          continue
        }
        composerFound = true
        composerNode = addedNode
        break
      }
      if (composerFound) {
        break
      }
    }
    if (!composerFound) {
      return
    }
    // Loop until the email composer is fully rendered...
    const id = setInterval(() => {
      // Determine if this is a plain-text email composer.
      const textareaEmailBody = composerNode.querySelector('textarea[data-testid="editor-textarea"]')

      if (textareaEmailBody !== null) {
        clearInterval(id)
        // The is a pkain-text email composer.
        log('A plain-text email composer has been rendered.')
        // Although at this point the text-only email composer has been rendered,
        // the textarea that contains the email body will still be empty.
        // As I couldn't figure out a proper way to determine when the textarea has been filled,
        // this ugly, hacky approach keeps monitoring the textarea until its value is not empty anymore.
        removeTextSignature(textareaEmailBody)
        return
      }
      // Determine if this is rich-text email composer.
      const composerFrame = composerNode.querySelector('iframe[data-testid="rooster-iframe"]')

      if (composerFrame !== null) {
        // The is a rich-text email composer.
        clearInterval(id)
        const id2 = setInterval(() => {
          const roosterEditor = composerFrame.contentDocument.getElementById('rooster-editor')

          if (!roosterEditor) {
            log('Rich-text email composer not ready yet...')
            return
          }
          clearInterval(id2)
          log('A rich-text email composer has been rendered.')
          const signatureNode = roosterEditor.querySelector('div.protonmail_signature_block')

          if (signatureNode) {
            // Signature node has been already rendered, remove it directly.
            removeHTMLSignature(signatureNode)
          } else {
            // Signature node hasn't been rendered yet, so monitor it.
            setupHTMLComposerObserver(roosterEditor)
          }
        // roosterEditor is not ready, try again in 50ms...
        }, 50)
      }
      // The composer frame is not ready, try again in 50ms...
    }, 50)
  }

  function removeTextSignature (textareaEmailBody) {
    const textSignature = /\n\n^Sent with Proton Mail secure email\.$/m

    // Monitors the textarea containing the text-based email body.
    // Runs at every 100ms and stops once the textarea's value is not empty.
    const id = setInterval(() => {
      if (textareaEmailBody.value === '') {
        return
      }
      if (!textSignature.test(textareaEmailBody.value)) {
        clearInterval(id)
        return
      }
      clearInterval(id)

      textareaEmailBody.value = textareaEmailBody.value.replace(textSignature, '')
      log('Signature successfully removed from text-only email.')

      // Move the text cursor back to the beginning of the textarea.
      textareaEmailBody.setSelectionRange(0, 0)
    }, 100)
  }

  function setupHTMLComposerObserver (roosterEditor) {
    const htmlComposerMonitor = new MutationObserver(detectHTMLSignatureNode)
    htmlComposerMonitor.observe(roosterEditor, {
      childList: true
    })
  }

  function detectHTMLSignatureNode (mutations, observer) {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (!(addedNode instanceof addedNode.ownerDocument.defaultView.HTMLElement)) {
          continue
        }
        if (!addedNode.classList.contains('protonmail_signature_block')) {
          continue
        }
        // Found the signature node, stop observing and remove it.
        observer.disconnect()
        removeHTMLSignature(addedNode)
        return
      }
    }
  }

  function isBlankLine (node) {
    if (!node) {
      return false
    }
    if (!(node instanceof node.ownerDocument.defaultView.HTMLDivElement)) {
      return false
    }
    if (!node.firstElementChild) {
      return false
    }
    if (!(node.firstElementChild instanceof node.firstElementChild.ownerDocument.defaultView.HTMLBRElement)) {
      return false
    }
    return true
  }

  function removeHTMLSignature (signatureNode) {
    // Email composer structure with custom user signature:
    //
    // <div id="rooster-editor">
    //   <div><br></div>
    //   <div><br></div>
    //   <div class="protonmail_signature_block">
    //     <div class="protonmail_signature_block-user">
    //       <div>Thanks,</div>
    //       <div>Guilherme<br></div>
    //     </div>
    //     <div><br></div>
    //     <div class="protonmail_signature_block-proton">
    //       Sent with <a href="https://proton.me/">Proton Mail</a> secure email.
    //     </div>
    //    </div>
    //  </div>

    // Email composer structure without custom user signature:
    //
    // <div id="rooster-editor">
    //   <div><br></div>
    //   <div><br></div>
    //   <div class="protonmail_signature_block">
    //     <div class="protonmail_signature_block-user protonmail_signature_block-empty"></div>
    //     <div class="protonmail_signature_block-proton">Sent with <a href="https://proton.me/">Proton Mail</a> secure email.</div>
    //   </div>
    // </div>
    const protonSignature = signatureNode.querySelector('.protonmail_signature_block-proton')

    if (!protonSignature) {
      log('BUG: Unable to find Proton\'s HTML signature to remove.')
      return
    }
    // Checks if there is a custom user signature.
    const userSignature = signatureNode.querySelector('.protonmail_signature_block-user:not(.protonmail_signature_block-empty)')

    if (!userSignature) {
      // Since there is no custom user signature, we can remove two blank lines added above the Proton signature.
      for (let i = 0; i < 2; i++) {
        if (isBlankLine(signatureNode.previousElementSibling)) {
          signatureNode.previousElementSibling.remove()
        }
      }
    }

    // Remove a blank line added below the Proton signature.
    if (isBlankLine(signatureNode.nextElementSibling)) {
      signatureNode.nextElementSibling.remove()
    }

    // Remove a blank line below the custom user signature.
    if (userSignature && isBlankLine(userSignature.nextElementSibling)) {
      userSignature.nextElementSibling.remove()
    }

    // Finally, remove the Proton signature node itself.
    protonSignature.remove()
    log('Signature successfully removed from HTML email.')
  }
})()
