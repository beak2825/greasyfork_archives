//@version 1.1

function checkAndRemoveModal() {
  var modal = document.querySelector(".modal-backdrop.fade");
  if (modal) {
    modal.remove();
  }
}

// Call the function initially to check for existing modal
checkAndRemoveModal();

// Set an interval to check and remove the modal every 100 milliseconds (adjustable)
setInterval(checkAndRemoveModal, 100);