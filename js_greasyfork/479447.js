
let input = document.getElementById("tdk-srch-input");
let autocmp=document.getElementById("autocmp");
autocmp.disabled=true;
autocmp.style.pointerEvents = "none";
autocmp.style.opacity = "0";
// Execute a function when the user presses a key on the keyboard


// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  input.addEventListener("keydown", function(event) {
    // If the user presses the "Ctrl+A" key combination
    if (event.ctrlKey && event.key === "a") {
      event.preventDefault();
      input.value = ""; // Clear the input value
    }
  });
  if (event.key != "Enter") {
    if ( event.key === "Alt" || event.key === "Tab") {
        return; 
        //For shortcuts
      }
    else {
    
    event.preventDefault();
    // Cancel the default action, if needed
    setInterval(function() {
      var divElements = document.querySelectorAll("#maddeler0");
      if(divElements){
        divElements.forEach(function(divElement) {
          var innerFailedDivElement = divElement.querySelector("#bulunmayan-gts");
          var innerSuccesfulDivElement = divElement.querySelector("#bulunan-gts0");
          if (innerFailedDivElement.textContent.trim() === "Bu söz bulunamadı.") {
            divElement.remove();
            console.log("removed")
          }
          if(innerSuccesfulDivElement.textContent.trim() !==input.value){
            divElement.remove();
            console.log("removed succesful one")
          }
        });
      } 
    
    }, 10);
    
    input.value=input.value+event.key;
    console.log("PressedEnter")
    document.getElementById("tdk-search-btn").click();
    // Trigger the button element with a click
    
    

  
    

    
    }
   
  }
});






