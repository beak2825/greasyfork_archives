// ==UserScript==
// @name         sdsWorkflow
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  A simple javascript snippet that allows users (specifically SDS Helpers & Curators) to check if the project is shared before the cutoff date or the user has more than one project in the studio.
// @author       Ptorioo
// @match        https://scratch.mit.edu/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490838/sdsWorkflow.user.js
// @updateURL https://update.greasyfork.org/scripts/490838/sdsWorkflow.meta.js
// ==/UserScript==

const studioID = 34747126; // Only modify this line to the current SDS

async function fetchCutOffDate(studioID) {
  try {
    const response = await fetch(
      `https://api.scratch.mit.edu/studios/${studioID}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching studio data: ${response.status}`);
    }
    const jsonData = await response.json();
    const createdDate = new Date(jsonData.history.created);

    const cutOffDate = new Date(
      createdDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );

    return cutOffDate;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function fetchProjectData(currentProjectID) {
  try {
    const response = await fetch(
      `https://api.scratch.mit.edu/projects/${currentProjectID}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching project data: ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function getScratchUsername(jsonData) {
  const author = jsonData.author;
  if (author) {
    return author.username;
  } else {
    console.warn("Username not found in project data.");
    return null;
  }
}

async function rejectByDate(jsonData, cutOffDate) {
  const sharedDate = new Date(jsonData.history.shared);
  if (sharedDate) {
    return sharedDate < cutOffDate;
  } else {
    console.warn("Shared date not found in project data.");
    return null;
  }
}

async function checkProjectsInStudio(
  username,
  cutOffDate,
  offset,
  currentProjectID
) {
  try {
    const response = await fetch(
      `https://api.scratch.mit.edu/users/${username}/projects/?limit=40&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching project data: ${response.status}`);
    }
    const jsonData = await response.json();

    if (jsonData.length === 0) {
      console.log("No more projects found for this user.");
      return;
    }

    for (const project of jsonData) {
      const projectID = project.id;
      const sharedDate = new Date(project.history.shared);
      if (sharedDate < cutOffDate) {
        console.log(
          `Scanning until project ${project.id} as it was shared before the cutoff date`
        );
        return;
      }
      const url = `https://api.scratch.mit.edu/users/${username}/projects/${projectID}/studios`;

      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const projectFound = data.some((studio) => studio.id === studioID);

          if (projectFound && projectID == currentProjectID) {
            console.log(
              `Project ${projectID} (current project) found in the studio!`
            );
          } else if (!projectFound && projectID == currentProjectID) {
            console.log(
              `Project ${projectID} (current project) not found in the studio.`
            );
          } else if (projectFound) {
            console.log(`Project ${projectID} found in the studio!`);
          } else {
            console.log(`Project ${projectID} not found in the studio.`);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }

    await checkProjectsInStudio(
      username,
      cutOffDate,
      offset + 40,
      currentProjectID
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

(async () => {
  const cutOffDate = await fetchCutOffDate(studioID);
  if (window.location.pathname.split("/")[1] == "projects") {
    const currentProjectID = parseInt(window.location.pathname.split("/")[2]);
    const data = await fetchProjectData(currentProjectID);
    const username = await getScratchUsername(data);
    const reject = await rejectByDate(data, cutOffDate);
    if (reject) {
      console.log(
        "Current project is shared before the cutoff date. (rejection is suggested)"
      );
    } else {
      console.log("Current project is shared after the cutoff date.");
    }
    if (username) {
      await checkProjectsInStudio(username, cutOffDate, 0, currentProjectID);
    } else {
      console.log("Username not found for the provided project ID.");
    }
  } else {
    return;
  }
})();
