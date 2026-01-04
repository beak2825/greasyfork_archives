// ==UserScript==
// @name         Angular Component Modifier
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Permite modificar propiedades de componentes en Angular en un servidor de desarrollo con funcionalidad para guardar y restaurar valores y navegar a componentes padre, incluye soporte para signals
// @author       Blas Santomé Ocampo
// @match        http://localhost:*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530292/Angular%20Component%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/530292/Angular%20Component%20Modifier.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const IGNORED_PROPERTIES = ["__ngContext__"];

  const STORAGE_KEY = "angularModifier_savedStates";
  let savedStates = {};

  let currentElement = null;

  try {
    const storedStates = localStorage.getItem(STORAGE_KEY);
    if (storedStates) {
      savedStates = JSON.parse(storedStates);
    }
  } catch (err) {
    console.warn("[Angular Modifier] Error al cargar estados guardados:", err);
  }
  console.log(
    "[Angular Modifier] UserScript cargado. Usa OPTION (⌥) + Click en un componente app-*."
  );

  document.addEventListener(
    "click",
    function (event) {
      if (!event.altKey) return;
      event.preventDefault();

      let ng = window.ng;
      if (!ng) {
        alert(
          "⚠️ Angular DevTools no está disponible. Asegúrate de estar en un servidor de desarrollo."
        );
        return;
      }

      let el = event.target;
      let component = null;
      let componentName = "Componente Desconocido";
      let componentId = "";

      while (el) {
        component = ng.getComponent(el);
        if (component && el.tagName.toLowerCase().startsWith("app-")) {
          componentName = el.tagName.toLowerCase();
          componentId = generateComponentId(el, componentName);
          currentElement = el;
          break;
        }
        el = el.parentElement;
      }

      if (!component) {
        alert(
          "⚠️ No se encontró un componente Angular válido (app-*) en la jerarquía."
        );
        return;
      }

      console.log(
        `[Angular Modifier] Componente seleccionado: ${componentName} (ID: ${componentId})`,
        component
      );

      showComponentEditor(component, componentName, componentId);
    },
    true
  );

  function generateComponentId(element, componentName) {
    let path = [];
    let current = element;
    while (current && current !== document.body) {
      let index = 0;
      let sibling = current;
      while ((sibling = sibling.previousElementSibling)) {
        index++;
      }
      path.unshift(index);
      current = current.parentElement;
    }
    return `${componentName}_${path.join("_")}`;
  }

  function navigateToParentComponent(currentEl) {
    let ng = window.ng;
    if (!ng) {
      alert(
        "⚠️ Angular DevTools no está disponible. Asegúrate de estar en un servidor de desarrollo."
      );
      return false;
    }

    if (!currentEl) {
      alert("⚠️ No hay ningún componente seleccionado actualmente.");
      return false;
    }

    let parentEl = currentEl.parentElement;
    let found = false;

    while (parentEl) {
      if (
        parentEl.tagName &&
        parentEl.tagName.toLowerCase().startsWith("app-") &&
        ng.getComponent(parentEl)
      ) {
        currentElement = parentEl;
        const component = ng.getComponent(parentEl);
        const componentName = parentEl.tagName.toLowerCase();
        const componentId = generateComponentId(parentEl, componentName);

        console.log(
          `[Angular Modifier] Navegando al componente padre: ${componentName} (ID: ${componentId})`,
          component
        );

        const existingModal = document.querySelector(".angular-modifier-modal");
        if (existingModal) {
          document.body.removeChild(existingModal);
        }

        showComponentEditor(component, componentName, componentId);
        found = true;
        break;
      }
      parentEl = parentEl.parentElement;
    }

    if (!found) {
      alert("⚠️ No se encontró un componente padre que comience con 'app-'.");
    }

    return found;
  }

  function showComponentEditor(component, componentName, componentId) {
    let modal = document.createElement("div");
    modal.className = "angular-modifier-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "white";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
    modal.style.zIndex = "10000";
    modal.style.borderRadius = "8px";
    modal.style.width = "400px";
    modal.style.maxHeight = "500px";
    modal.style.overflowY = "auto";

    let title = document.createElement("h3");
    title.innerText = componentName;
    title.style.marginTop = "0";
    modal.appendChild(title);

    let form = document.createElement("form");

    let formGroups = {};
    let editableProps = {};
    let signals = {};

    // Add signals section title
    let signalsTitle = document.createElement("h4");
    signalsTitle.innerText = "Signals";
    signalsTitle.style.marginTop = "15px";
    signalsTitle.style.color = "#007bff";
    signalsTitle.style.display = "none"; // Hide initially, show only if signals are found
    form.appendChild(signalsTitle);

    // Separate div for signals
    let signalsDiv = document.createElement("div");
    signalsDiv.style.marginLeft = "10px";
    form.appendChild(signalsDiv);

    Object.keys(component).forEach((prop) => {
      if (IGNORED_PROPERTIES.includes(prop)) return;

      let value = component[prop];

      if (typeof value === "function") {
        // Check if this is a signal (signals are functions with specific properties)
        if (isSignal(value)) {
          signalsTitle.style.display = "block"; // Show signals section title
          appendSignalField(signalsDiv, component, prop, value);
          signals[prop] = value;
          return;
        }
        return;
      }

      if (
        value &&
        typeof value === "object" &&
        value.constructor.name === "FormGroup"
      ) {
        formGroups[prop] = value;
        appendFormGroupFields(form, value, prop);
        return;
      }

      if (value !== null && typeof value === "object") return;

      let input = appendEditableField(form, component, prop, value);
      if (input) {
        editableProps[prop] = {
          type: typeof value,
          input: input,
        };
      }
    });

    modal.appendChild(form);

    let parentComponentButton = document.createElement("button");
    parentComponentButton.innerText = "Ir al Componente Padre";
    parentComponentButton.style.marginTop = "15px";
    parentComponentButton.style.width = "100%";
    parentComponentButton.style.padding = "8px";
    parentComponentButton.style.background = "#ffc107";
    parentComponentButton.style.color = "black";
    parentComponentButton.style.border = "none";
    parentComponentButton.style.borderRadius = "5px";
    parentComponentButton.style.cursor = "pointer";
    parentComponentButton.style.fontWeight = "bold";

    parentComponentButton.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToParentComponent(currentElement);
    });

    modal.appendChild(parentComponentButton);

    let stateManagementDiv = document.createElement("div");
    stateManagementDiv.style.marginTop = "15px";
    stateManagementDiv.style.borderTop = "1px solid #eee";
    stateManagementDiv.style.paddingTop = "10px";

    let saveStateButton = document.createElement("button");
    saveStateButton.innerText = "Guardar Estado Actual";
    saveStateButton.style.padding = "5px 10px";
    saveStateButton.style.marginRight = "10px";
    saveStateButton.style.background = "#28a745";
    saveStateButton.style.color = "white";
    saveStateButton.style.border = "none";
    saveStateButton.style.borderRadius = "5px";
    saveStateButton.style.cursor = "pointer";
    saveStateButton.addEventListener("click", (e) => {
      e.preventDefault();
      saveCurrentState(component, componentId, formGroups, editableProps, signals);
    });
    stateManagementDiv.appendChild(saveStateButton);

    let restoreStateButton = document.createElement("button");
    restoreStateButton.innerText = "Restaurar Estado";
    restoreStateButton.style.padding = "5px 10px";
    restoreStateButton.style.background = "#007bff";
    restoreStateButton.style.color = "white";
    restoreStateButton.style.border = "none";
    restoreStateButton.style.borderRadius = "5px";
    restoreStateButton.style.cursor = "pointer";

    if (!savedStates[componentId]) {
      restoreStateButton.disabled = true;
      restoreStateButton.style.opacity = "0.5";
      restoreStateButton.style.cursor = "not-allowed";
    }

    restoreStateButton.addEventListener("click", (e) => {
      e.preventDefault();
      restoreSavedState(component, componentId, formGroups, editableProps, signals);
    });
    stateManagementDiv.appendChild(restoreStateButton);

    modal.appendChild(stateManagementDiv);

    let fileLabel = document.createElement("label");
    fileLabel.innerText = "Cargar JSON:";
    fileLabel.style.display = "block";
    fileLabel.style.marginTop = "15px";
    modal.appendChild(fileLabel);

    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/json";
    fileInput.style.marginTop = "5px";
    fileInput.style.width = "100%";
    fileInput.addEventListener("change", (event) =>
      handleFileUpload(event, formGroups, signals)
    );
    modal.appendChild(fileInput);

    let exportButton = document.createElement("button");
    exportButton.innerText = "Exportar a JSON";
    exportButton.style.marginTop = "10px";
    exportButton.style.width = "100%";
    exportButton.style.padding = "5px";
    exportButton.style.background = "#17a2b8";
    exportButton.style.color = "white";
    exportButton.style.border = "none";
    exportButton.style.borderRadius = "5px";
    exportButton.style.cursor = "pointer";
    exportButton.addEventListener("click", (e) => {
      e.preventDefault();
      exportToJson(component, formGroups, signals);
    });
    modal.appendChild(exportButton);

    let closeButton = document.createElement("button");
    closeButton.innerText = "Cerrar";
    closeButton.style.marginTop = "10px";
    closeButton.style.width = "100%";
    closeButton.style.padding = "5px";
    closeButton.style.background = "#d9534f";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modal.appendChild(closeButton);
    document.body.appendChild(modal);
  }

  // Function to check if a property is an Angular signal
  function isSignal(value) {
    return typeof value === 'function' &&
           (value.name === 'Signal' ||
            (typeof value() !== 'undefined' &&
             typeof value.set === 'function'));
  }

  // Function to append a signal field to the form
  function appendSignalField(container, component, prop, signal) {
    try {
      // Get current value
      const currentValue = signal();

      let signalLabel = document.createElement("label");
      signalLabel.innerText = `${prop} (signal)`;
      signalLabel.style.display = "block";
      signalLabel.style.marginTop = "5px";
      signalLabel.style.fontWeight = "bold";
      signalLabel.style.color = "#007bff";

      let signalInput = document.createElement("input");
      signalInput.style.width = "100%";
      signalInput.style.marginTop = "2px";
      signalInput.dataset.signalName = prop;

      if (typeof currentValue === "boolean") {
        signalInput.type = "checkbox";
        signalInput.checked = currentValue;
      } else if (typeof currentValue === "number") {
        signalInput.type = "number";
        signalInput.value = currentValue;
      } else if (typeof currentValue === "string") {
        signalInput.type = "text";
        signalInput.value = currentValue;
      } else if (currentValue === null || currentValue === undefined) {
        signalInput.type = "text";
        signalInput.value = "";
        signalInput.placeholder = "undefined/null";
      } else {
        // Complex object - not directly editable
        let valueInfo = document.createElement("div");
        valueInfo.innerText = `Valor complejo (${typeof currentValue}): ${JSON.stringify(currentValue).substring(0, 50)}${JSON.stringify(currentValue).length > 50 ? '...' : ''}`;
        valueInfo.style.fontSize = "12px";
        valueInfo.style.marginBottom = "10px";
        valueInfo.style.color = "#666";
        container.appendChild(signalLabel);
        container.appendChild(valueInfo);
        return;
      }

      signalInput.addEventListener("change", () => {
        try {
          let newValue;
          if (signalInput.type === "checkbox") {
            newValue = signalInput.checked;
          } else if (signalInput.type === "number") {
            newValue = parseFloat(signalInput.value);
          } else {
            newValue = signalInput.value;
          }

          // Update the signal value using set() method
          signal.set(newValue);
          console.log(`[Angular Modifier] Se actualizó signal '${prop}' a ${newValue}`);
        } catch (err) {
          alert(`⚠️ Error al actualizar signal '${prop}': ${err.message}`);
        }
      });

      container.appendChild(signalLabel);
      container.appendChild(signalInput);

      return signalInput;
    } catch (err) {
      console.warn(`[Angular Modifier] Error al procesar signal '${prop}':`, err);
      return null;
    }
  }

  function appendEditableField(form, component, prop, value) {
    let label = document.createElement("label");
    label.innerText = prop;
    label.style.display = "block";
    label.style.marginTop = "5px";

    let input = document.createElement("input");
    input.style.width = "100%";
    input.style.marginTop = "2px";
    input.dataset.propName = prop;

    if (typeof value === "boolean") {
      input.type = "checkbox";
      input.checked = value;
    } else if (typeof value === "number") {
      input.type = "number";
      input.value = value;
    } else if (typeof value === "string") {
      input.type = "text";
      input.value = value;
    } else {
      return null;
    }

    input.addEventListener("change", () => {
      try {
        if (input.type === "checkbox") {
          component[prop] = input.checked;
        } else if (input.type === "number") {
          component[prop] = parseFloat(input.value);
        } else {
          component[prop] = input.value;
        }
        if (typeof ng.applyChanges === "function") {
          ng.applyChanges(component);
          console.log(`[Angular Modifier] Se aplicaron cambios en ${prop}`);
        }
      } catch (err) {
        alert(`⚠️ Error al actualizar '${prop}': ${err.message}`);
      }
    });

    form.appendChild(label);
    form.appendChild(input);
    return input;
  }

  function appendFormGroupFields(form, formGroup, formGroupName) {
    let formGroupTitle = document.createElement("h4");
    formGroupTitle.innerText = `Formulario: ${formGroupName}`;
    formGroupTitle.style.marginTop = "10px";
    formGroupTitle.style.color = "#007bff";
    form.appendChild(formGroupTitle);

    if (formGroup.controls) {
      Object.keys(formGroup.controls).forEach((controlName) => {
        try {
          const control = formGroup.controls[controlName];
          const currentValue = control.value;

          let controlLabel = document.createElement("label");
          controlLabel.innerText = controlName;
          controlLabel.style.display = "block";
          controlLabel.style.marginTop = "5px";
          controlLabel.style.marginLeft = "10px";

          let controlInput = document.createElement("input");
          controlInput.style.width = "95%";
          controlInput.style.marginTop = "2px";
          controlInput.style.marginLeft = "10px";
          controlInput.dataset.formGroup = formGroupName;
          controlInput.dataset.controlName = controlName;

          if (typeof currentValue === "boolean") {
            controlInput.type = "checkbox";
            controlInput.checked = currentValue;
          } else if (typeof currentValue === "number") {
            controlInput.type = "number";
            controlInput.value = currentValue;
          } else {
            controlInput.type = "text";
            controlInput.value =
              currentValue !== null && currentValue !== undefined
                ? currentValue
                : "";
          }

          controlInput.addEventListener("change", () => {
            try {
              let newValue;
              if (controlInput.type === "checkbox") {
                newValue = controlInput.checked;
              } else if (controlInput.type === "number") {
                newValue = parseFloat(controlInput.value);
              } else {
                newValue = controlInput.value;
              }

              control.setValue(newValue);
              console.log(
                `[Angular Modifier] Actualizado control '${controlName}' en FormGroup '${formGroupName}'`
              );
            } catch (err) {
              alert(
                `⚠️ Error al actualizar control '${controlName}': ${err.message}`
              );
            }
          });

          form.appendChild(controlLabel);
          form.appendChild(controlInput);
        } catch (err) {
          console.warn(
            `[Angular Modifier] Error al mostrar control '${controlName}':`,
            err
          );
        }
      });
    }
  }

  function handleFileUpload(event, formGroups, signals) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (event) {
      try {
        let jsonData = JSON.parse(event.target.result);
        applyJsonToForm(jsonData, formGroups, signals);
      } catch (err) {
        alert("⚠️ Error al cargar JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  function applyJsonToForm(jsonData, formGroups, signals) {
    if (jsonData.properties) {
      Object.keys(jsonData.properties).forEach((prop) => {
        if (IGNORED_PROPERTIES.includes(prop)) return;

        try {
          const inputElement = document.querySelector(
            `input[data-prop-name="${prop}"]`
          );
          if (inputElement) {
            if (inputElement.type === "checkbox") {
              inputElement.checked = jsonData.properties[prop];
            } else {
              inputElement.value = jsonData.properties[prop];
            }
            inputElement.dispatchEvent(new Event("change"));
          }
        } catch (err) {
          console.warn(
            `[Angular Modifier] Error al aplicar propiedad '${prop}':`,
            err
          );
        }
      });
    }

    if (jsonData.signals) {
      Object.keys(jsonData.signals).forEach((signalName) => {
        if (signals[signalName]) {
          try {
            const signalValue = jsonData.signals[signalName];
            signals[signalName].set(signalValue);

            const signalInput = document.querySelector(
              `input[data-signal-name="${signalName}"]`
            );
            if (signalInput) {
              if (signalInput.type === "checkbox") {
                signalInput.checked = signalValue;
              } else {
                signalInput.value = signalValue;
              }
            }

            console.log(`[Angular Modifier] Signal '${signalName}' actualizado`);
          } catch (err) {
            console.warn(
              `[Angular Modifier] Error al actualizar signal '${signalName}':`,
              err
            );
          }
        }
      });
    }

    if (jsonData.formGroups) {
      Object.keys(jsonData.formGroups).forEach((groupName) => {
        if (formGroups[groupName]) {
          let formGroup = formGroups[groupName];
          const groupData = jsonData.formGroups[groupName];

          Object.keys(groupData).forEach((controlName) => {
            if (formGroup.controls[controlName]) {
              try {
                formGroup.controls[controlName].setValue(
                  groupData[controlName]
                );

                const controlInput = document.querySelector(
                  `input[data-form-group="${groupName}"][data-control-name="${controlName}"]`
                );
                if (controlInput) {
                  if (controlInput.type === "checkbox") {
                    controlInput.checked = groupData[controlName];
                  } else {
                    controlInput.value = groupData[controlName];
                  }
                }

                console.log(
                  `[Angular Modifier] Campo '${controlName}' de '${groupName}' actualizado`
                );
              } catch (err) {
                console.warn(
                  `[Angular Modifier] Error al actualizar control '${controlName}':`,
                  err
                );
              }
            }
          });
        }
      });
    }
  }

  function exportToJson(component, formGroups, signals) {
    let exportData = {
      properties: {},
      formGroups: {},
      signals: {}
    };

    Object.keys(component).forEach((prop) => {
      if (IGNORED_PROPERTIES.includes(prop)) return;

      let value = component[prop];
      if (
        typeof value !== "function" &&
        value !== null &&
        typeof value !== "object"
      ) {
        exportData.properties[prop] = value;
      }
    });

    // Export signals
    Object.keys(signals).forEach((signalName) => {
      try {
        const signal = signals[signalName];
        const value = signal();

        // Only export primitive values that can be safely serialized
        if (value === null || typeof value === "undefined" ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean") {
          exportData.signals[signalName] = value;
        }
      } catch (err) {
        console.warn(
          `[Angular Modifier] Error al exportar signal '${signalName}':`,
          err
        );
      }
    });

    Object.keys(formGroups).forEach((groupName) => {
      const formGroup = formGroups[groupName];
      exportData.formGroups[groupName] = {};

      if (formGroup.controls) {
        Object.keys(formGroup.controls).forEach((controlName) => {
          try {
            exportData.formGroups[groupName][controlName] =
              formGroup.controls[controlName].value;
          } catch (err) {
            console.warn(
              `[Angular Modifier] Error al exportar control '${controlName}':`,
              err
            );
          }
        });
      }
    });

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `angular-component-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function saveCurrentState(component, componentId, formGroups, editableProps, signals) {
    let state = {
      properties: {},
      formGroups: {},
      signals: {}
    };

    Object.keys(editableProps).forEach((prop) => {
      if (IGNORED_PROPERTIES.includes(prop)) return;

      const input = editableProps[prop].input;
      if (input.type === "checkbox") {
        state.properties[prop] = input.checked;
      } else if (input.type === "number") {
        state.properties[prop] = parseFloat(input.value);
      } else {
        state.properties[prop] = input.value;
      }
    });

    // Save signal values
    Object.keys(signals).forEach((signalName) => {
      try {
        const signal = signals[signalName];
        const value = signal();

        // Only save primitive values that can be safely serialized
        if (value === null || typeof value === "undefined" ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean") {
          state.signals[signalName] = value;
        }
      } catch (err) {
        console.warn(
          `[Angular Modifier] Error al guardar signal '${signalName}':`,
          err
        );
      }
    });

    Object.keys(formGroups).forEach((groupName) => {
      const formGroup = formGroups[groupName];
      state.formGroups[groupName] = {};

      if (formGroup.controls) {
        Object.keys(formGroup.controls).forEach((controlName) => {
          try {
            state.formGroups[groupName][controlName] =
              formGroup.controls[controlName].value;
          } catch (err) {
            console.warn(
              `[Angular Modifier] Error al guardar control '${controlName}':`,
              err
            );
          }
        });
      }
    });

    savedStates[componentId] = state;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStates));
      alert(`✅ Estado guardado correctamente para ${componentId}`);
    } catch (err) {
      console.error("[Angular Modifier] Error al guardar estado:", err);
      alert("⚠️ Error al guardar estado: " + err.message);
    }
  }

  function restoreSavedState(
    component,
    componentId,
    formGroups,
    editableProps,
    signals
  ) {
    const savedState = savedStates[componentId];
    if (!savedState) {
      alert("⚠️ No hay estado guardado para este componente");
      return;
    }

    if (savedState.properties) {
      Object.keys(savedState.properties).forEach((prop) => {
        if (IGNORED_PROPERTIES.includes(prop)) return;

        if (editableProps[prop]) {
          const input = editableProps[prop].input;
          const value = savedState.properties[prop];

          if (input.type === "checkbox") {
            input.checked = value;
          } else {
            input.value = value;
          }

          try {
            component[prop] = value;
          } catch (err) {
            console.warn(
              `[Angular Modifier] Error al restaurar propiedad '${prop}':`,
              err
            );
          }
        }
      });
    }

    // Restore signal values
    if (savedState.signals) {
      Object.keys(savedState.signals).forEach((signalName) => {
        if (signals[signalName]) {
          try {
            const signalValue = savedState.signals[signalName];
            signals[signalName].set(signalValue);

            const signalInput = document.querySelector(
              `input[data-signal-name="${signalName}"]`
            );
            if (signalInput) {
              if (signalInput.type === "checkbox") {
                signalInput.checked = signalValue;
              } else {
                signalInput.value = signalValue;
              }
            }

            console.log(`[Angular Modifier] Signal '${signalName}' restaurado`);
          } catch (err) {
            console.warn(
              `[Angular Modifier] Error al restaurar signal '${signalName}':`,
              err
            );
          }
        }
      });
    }

    if (savedState.formGroups) {
      Object.keys(savedState.formGroups).forEach((groupName) => {
        if (formGroups[groupName]) {
          const formGroup = formGroups[groupName];
          const groupData = savedState.formGroups[groupName];

          Object.keys(groupData).forEach((controlName) => {
            if (formGroup.controls[controlName]) {
              try {
                formGroup.controls[controlName].setValue(
                  groupData[controlName]
                );

                const controlInput = document.querySelector(
                  `input[data-form-group="${groupName}"][data-control-name="${controlName}"]`
                );
                if (controlInput) {
                  if (controlInput.type === "checkbox") {
                    controlInput.checked = groupData[controlName];
                  } else {
                    controlInput.value = groupData[controlName];
                  }
                }
              } catch (err) {
                console.warn(
                  `[Angular Modifier] Error al restaurar control '${controlName}':`,
                  err
                );
              }
            }
          });
        }
      });
    }

    if (typeof ng.applyChanges === "function") {
      ng.applyChanges(component);
      console.log(`[Angular Modifier] Se restauró el estado del componente`);
    }

    alert(`✅ Estado restaurado correctamente para ${componentId}`);
  }
})();